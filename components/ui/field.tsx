import { forwardRef, useId } from "react";
import { cn } from "@/utlis/cn";

const control =
  "w-full border-0 border-b border-line-strong bg-transparent py-2 text-fg outline-none transition-colors duration-150 placeholder:text-fg-3 focus:border-fg focus-visible:outline-none";

type FieldProps = {
  label: string;
  hint?: string;
  className?: string;
};

export const Field = forwardRef<
  HTMLInputElement,
  FieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">
>(function Field({ label, hint, className, id, ...props }, ref) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={fieldId} className="flex justify-between text-fg-2">
        <span>{label}</span>
        {hint && <span className="text-fg-3">{hint}</span>}
      </label>
      <input ref={ref} id={fieldId} className={control} {...props} />
    </div>
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  FieldProps &
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">
>(function TextArea({ label, hint, className, id, ...props }, ref) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={fieldId} className="flex justify-between text-fg-2">
        <span>{label}</span>
        {hint && <span className="text-fg-3">{hint}</span>}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(control, "field-sizing-content min-h-16 resize-none")}
        {...props}
      />
    </div>
  );
});
