import React from 'react';

export interface {{Name}}Props {
  children?: React.ReactNode;
  className?: string;
}

export const {{Name}}: React.FC<{{Name}}Props> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

{{Name}}.displayName = '{{Name}}';
