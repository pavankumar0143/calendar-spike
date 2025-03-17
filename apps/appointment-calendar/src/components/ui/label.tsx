import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>,
  VariantProps<typeof labelVariants> {
  children?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
    </label>
  )
)
Label.displayName = "Label"

export { Label } 