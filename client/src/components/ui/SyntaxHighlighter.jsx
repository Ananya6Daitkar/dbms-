import React from 'react';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'LIKE', 'BETWEEN',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT',
  'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
  'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
  'EXTRACT', 'MONTH', 'YEAR', 'DAY', 'COALESCE'
];

const TABLE_NAMES = [
  'Customer', 'Restaurant', 'Orders', 'Menu_Item', 'Delivery_Partner',
  'Delivers', 'Payment', 'Ratings'
];

function tokenizeSQL(sql) {
  const tokens = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    
    // Handle strings
    if ((char === "'" || char === '"') && !inString) {
      if (current) {
        tokens.push({ type: 'text', value: current });
        current = '';
      }
      inString = true;
      stringChar = char;
      current = char;
      continue;
    }
    
    if (inString && char === stringChar) {
      current += char;
      tokens.push({ type: 'string', value: current });
      current = '';
      inString = false;
      stringChar = '';
      continue;
    }
    
    if (inString) {
      current += char;
      continue;
    }
    
    // Handle whitespace and special chars
    if (/[\s,();=<>*]/.test(char)) {
      if (current) {
        tokens.push({ type: 'text', value: current });
        current = '';
      }
      tokens.push({ type: 'whitespace', value: char });
      continue;
    }
    
    current += char;
  }
  
  if (current) {
    tokens.push({ type: inString ? 'string' : 'text', value: current });
  }
  
  return tokens;
}

function classifyToken(token) {
  if (token.type === 'string') return 'string';
  if (token.type === 'whitespace') return 'whitespace';
  
  const value = token.value.toUpperCase();
  
  // Check if it's a keyword
  if (SQL_KEYWORDS.includes(value)) return 'keyword';
  
  // Check if it's a table name
  if (TABLE_NAMES.includes(token.value)) return 'table';
  
  // Check if it's a number
  if (/^\d+(\.\d+)?$/.test(token.value)) return 'number';
  
  return 'identifier';
}

export default function SyntaxHighlighter({ sql }) {
  const tokens = tokenizeSQL(sql);
  
  return (
    <pre className="bg-space-dark/50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
      <code>
        {tokens.map((token, index) => {
          const type = classifyToken(token);
          
          let className = 'text-gray-300';
          
          if (type === 'keyword') className = 'text-neon-purple font-semibold';
          else if (type === 'table') className = 'text-neon-blue';
          else if (type === 'string') className = 'text-yellow-400';
          else if (type === 'number') className = 'text-blue-400';
          else if (type === 'whitespace') className = '';
          
          return (
            <span key={index} className={className}>
              {token.value}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
