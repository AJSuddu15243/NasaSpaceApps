import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import { cn } from '../utils';

export const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup className={cn('flex h-full w-full', className)} {...props} />
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export const ResizablePanel = ResizablePrimitive.Panel;
export type { ImperativePanelHandle } from 'react-resizable-panels';

export const ResizableHandle = ({ className, withHandle = false, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & { withHandle?: boolean }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn('group relative flex w-[3px] shrink-0 items-center justify-center bg-transparent transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none data-[resize-handle-state=drag]:bg-accent', className)}
    {...props}
  >
    <div className={cn('-translate-x-1/2 absolute left-1/2 z-10 flex h-8 w-4 items-center justify-center rounded-full border border-border bg-card opacity-0 shadow-panel transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[resize-handle-state=drag]:opacity-100', withHandle && 'opacity-100')}>
      <GripVertical className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
    </div>
  </ResizablePrimitive.PanelResizeHandle>
);
ResizableHandle.displayName = 'ResizableHandle';
