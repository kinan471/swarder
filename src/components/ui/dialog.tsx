import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />
          <div className="relative z-50 w-full max-w-lg">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-background p-6 rounded-lg shadow-lg border",
      className
    )}>
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>
      {children}
    </div>
  )
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children, onClick }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick });
  }
  return <span onClick={onClick}>{children}</span>
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger }
