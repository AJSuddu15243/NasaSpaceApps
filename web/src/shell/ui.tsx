import type { ButtonHTMLAttributes, ComponentType, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' };
type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'sun' | 'earth' | 'success' | 'warning' | 'danger' };
interface Toolkit { Button: ComponentType<ButtonProps>; Input: ComponentType<InputHTMLAttributes<HTMLInputElement>>; Label: ComponentType<LabelHTMLAttributes<HTMLLabelElement>>; Card: ComponentType<HTMLAttributes<HTMLDivElement>>; Badge: ComponentType<BadgeProps> }
// WEB-2 can plug in without editing shell files; absent on WEB-1's independent branch.
const kit = Object.values(import.meta.glob<Toolkit>('../design/index.ts', { eager: true }))[0];
function NativeButton({ variant = 'default', className = '', type = 'button', ...props }: ButtonProps) { return <button type={type} className={`ui-button ui-button-${variant} ${className}`} {...props} />; }
export const Button = kit?.Button ?? NativeButton;
export const Input = kit?.Input ?? ((props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`ui-input ${props.className ?? ''}`} />);
export const Label = kit?.Label ?? ((props: LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className={`ui-label ${props.className ?? ''}`} />);
export const Card = kit?.Card ?? ((props: HTMLAttributes<HTMLDivElement>) => <div {...props} className={`ui-card ${props.className ?? ''}`} />);
export const Badge = kit?.Badge ?? (({ tone = 'neutral', ...props }: BadgeProps) => <span {...props} className={`ui-badge tone-${tone} ${props.className ?? ''}`} />);
