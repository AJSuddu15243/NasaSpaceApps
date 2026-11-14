import { useEffect, useRef, useState } from 'react';
export function useSceneVisibility() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? false; update(); });
    if (hostRef.current) observer.observe(hostRef.current);
    document.addEventListener('visibilitychange', update); update();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return { hostRef, active };
}
