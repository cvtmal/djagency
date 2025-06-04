import * as React from 'react';

declare module '@/shadcn/ui/button' {
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  
  export const buttonVariants: (props: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
  }) => string;
}

declare module '@/shadcn/ui/dialog' {
  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }

  export interface DialogContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface DialogHeaderProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface DialogFooterProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface DialogTitleProps {
    className?: string;
    children?: React.ReactNode;
  }

  export const Dialog: React.FC<DialogProps>;
  export const DialogContent: React.FC<DialogContentProps>;
  export const DialogHeader: React.FC<DialogHeaderProps>;
  export const DialogFooter: React.FC<DialogFooterProps>;
  export const DialogTitle: React.FC<DialogTitleProps>;
}

declare module '@/shadcn/ui/calendar' {
  export interface CalendarProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date } | undefined;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
    classNames?: Record<string, string>;
    showOutsideDays?: boolean;
    disabled?: boolean;
    required?: boolean;
    children?: React.ReactNode;
  }

  export const Calendar: React.FC<CalendarProps>;
}
