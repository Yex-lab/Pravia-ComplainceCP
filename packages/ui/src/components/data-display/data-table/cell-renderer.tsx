import React from 'react';
import { 
  ActionsCell, 
  AvatarNameCell, 
  TextCell, 
  ChipCell, 
  DateCell, 
  SwitchCell 
} from './cells';

// Cell renderer registry
const cellRenderers = {
  'text': TextCell,
  'avatar-name': AvatarNameCell,
  'chip': ChipCell,
  'date': DateCell,
  'switch': SwitchCell,
  'actions': ActionsCell,
};

export type CellType = keyof typeof cellRenderers;

// JSON schema interfaces
export interface CellConfig {
  type: CellType;
  props?: Record<string, any>;
}

export interface JsonColumn<T> {
  id: keyof T;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  cell?: CellConfig;
}

// Cell renderer factory
export const renderCell = (
  cellConfig: CellConfig | undefined,
  value: any,
  row: any,
  column: JsonColumn<any>
): React.ReactNode => {
  if (!cellConfig) {
    // Default to text cell
    return <TextCell value={value} />;
  }

  const CellComponent = cellRenderers[cellConfig.type];
  
  if (!CellComponent) {
    console.warn(`Unknown cell type: ${cellConfig.type}`);
    return <TextCell value={value} />;
  }

  // Prepare props based on cell type
  const cellProps = prepareCellProps(cellConfig.type, cellConfig.props, value, row, column);

  return <CellComponent {...(cellProps as any)} />;
};

// Helper to prepare props for each cell type
const prepareCellProps = (
  cellType: CellType,
  configProps: Record<string, any> = {},
  value: any,
  row: any,
  column: JsonColumn<any>
) => {
  const baseProps = { ...configProps };

  switch (cellType) {
    case 'text':
      return {
        value,
        variant: configProps.variant || 'body2',
        color: configProps.color,
        fallback: configProps.fallback,
        ...baseProps,
      };

    case 'avatar-name':
      return {
        name: configProps.nameField ? row[configProps.nameField] : value,
        avatar: configProps.avatarField ? row[configProps.avatarField] : configProps.avatar,
        subtitle: configProps.subtitleField ? row[configProps.subtitleField] : configProps.subtitle,
        email: configProps.emailField ? row[configProps.emailField] : configProps.email,
        onClick: configProps.onClick,
        ...baseProps,
      };

    case 'chip':
      return {
        value,
        color: configProps.colorMapping?.[value] || configProps.color || 'default',
        variant: configProps.variant || 'filled',
        fallback: configProps.fallback,
        ...baseProps,
      };

    case 'date':
      return {
        date: value,
        format: configProps.format || 'MM/dd/yyyy',
        fallback: configProps.fallback,
        variant: configProps.variant,
        ...baseProps,
      };

    case 'switch':
      return {
        checked: Boolean(value),
        onChange: configProps.onChange || (() => {}),
        disabled: configProps.disabled,
        size: configProps.size,
        color: configProps.color,
        ...baseProps,
      };

    case 'actions':
      return {
        actions: configProps.actions || [],
        moreIcon: configProps.moreIcon,
        ...baseProps,
      };

    default:
      return { value, ...baseProps };
  }
};

// Helper to convert JSON schema to DataTable columns
export const createColumnsFromSchema = <T,>(
  jsonColumns: JsonColumn<T>[],
  actionHandlers?: Record<string, (row: T) => void>
) => {
  return jsonColumns.map(column => ({
    id: column.id,
    label: column.label,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    sortable: column.sortable,
    render: column.cell 
      ? (value: any, row: T) => {
          // Inject action handlers for actions cell
          if (column.cell?.type === 'actions' && actionHandlers) {
            const actionsWithHandlers = column.cell.props?.actions?.map((action: any) => ({
              ...action,
              onClick: () => actionHandlers[action.action]?.(row),
            }));
            
            const cellConfigWithHandlers = {
              ...column.cell,
              props: {
                ...column.cell.props,
                actions: actionsWithHandlers,
              },
            };
            
            return renderCell(cellConfigWithHandlers, value, row, column);
          }
          
          return renderCell(column.cell, value, row, column);
        }
      : undefined,
  }));
};

export { cellRenderers };
