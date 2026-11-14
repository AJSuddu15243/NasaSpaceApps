import * as React from 'react';
import { cn } from '../utils';
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => <input ref={ref} type={type} className={cn('min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:opacity-50 aria-[invalid=true]:border-danger', className)} {...props} />,
);
Input.displayName = 'Input';
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-2 block text-sm font-medium', className)} {...props} />;
}
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-border bg-card p-6 text-card-foreground shadow-panel', className)} {...props} />;
}
export type BadgeTone = 'neutral' | 'sun' | 'earth' | 'success' | 'warning' | 'danger';
const tones: Record<BadgeTone, string> = {
  neutral: 'text-foreground border-border', sun: 'text-sun border-sun/40', earth: 'text-earth border-earth/40',
  success: 'text-success border-success/40', warning: 'text-warning border-warning/40', danger: 'text-danger border-danger/40',
};
export function Badge({ tone = 'neutral', className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={cn('inline-flex items-center rounded-sm border bg-background px-2 py-1 text-xs font-medium', tones[tone], className)} {...props} />;
}
export function Separator() { return <hr className="my-6 border-border" />; }
export function Skeleton({ label = 'Loading', className }: { label?: string; className?: string }) {
  return <div role="status" aria-label={label} className={cn('min-h-24 rounded-md bg-muted', className)}><span className="sr-only">{label}</span></div>;
}
export function Alert({ title, children, destructive = false }: { title: string; children: React.ReactNode; destructive?: boolean }) {
  return <div role={destructive ? 'alert' : 'status'} className={cn('rounded-md border p-4', destructive ? 'border-danger text-danger' : 'border-border text-foreground')}>
    <p className="font-medium">{title}</p><div className="mt-1 text-sm text-foreground">{children}</div>
  </div>;
}
