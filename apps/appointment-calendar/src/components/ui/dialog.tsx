import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="dialog-root">
      {children}
    </div>
  );
};

interface DialogTriggerProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

interface DialogPortalProps {
  children?: React.ReactNode;
}

const DialogPortal: React.FC<DialogPortalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {children}
    </div>
  );
};

interface DialogOverlayProps {
  className?: string;
  onClick?: () => void;
}

const DialogOverlay: React.FC<DialogOverlayProps> = ({ className, onClick }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={onClick}
    />
  );
};

interface DialogCloseProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const DialogClose: React.FC<DialogCloseProps> = ({ className, onClick, children }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
    >
      {children || (
        <>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </>
      )}
    </button>
  );
};

interface DialogContentProps {
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const DialogContent: React.FC<DialogContentProps> = ({ className, children, onClose }) => {
  return (
    <DialogPortal>
      <DialogOverlay onClick={onClose} />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
      >
        {children}
        <DialogClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClose}
        />
      </div>
    </DialogPortal>
  );
};

interface DialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface DialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const DialogFooter: React.FC<DialogFooterProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface DialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children, ...props }) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

interface DialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, children, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
);

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} 