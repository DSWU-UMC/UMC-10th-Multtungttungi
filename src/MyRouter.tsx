import { useState, useEffect, useMemo, Children, isValidElement, cloneElement, ReactNode, ReactElement } from 'react';

// 1. Link: 클릭 시 새로고침을 막고 주소만 바꾼 뒤, 리액트에게 알림을 보냅니다.
export const Link = ({ to, children }: { to: string; children: ReactNode }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    
    // ⭐ 중요: 주소가 바뀌었다는 이벤트를 강제로 발생시켜 Routes가 알게 합니다.
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return <a href={to} onClick={handleClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{children}</a>;
};

// 2. Route: 정보를 담는 그릇일 뿐, 실제 렌더링은 하지 않습니다.
export const Route = ({ component: Component }: { path: string; component: React.ComponentType<any> }) => {
  return <Component />;
};

// 3. Routes: 현재 주소와 일치하는 자식을 찾아 화면에 뿌려줍니다.
export const Routes = ({ children }: { children: ReactNode }) => {
  // ⭐ 핵심: 현재 경로를 '상태'로 관리해야 리액트가 화면을 다시 그립니다.
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    // 브라우저의 뒤로가기/앞로가기 및 위에서 만든 커스텀 이벤트를 감지합니다.
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isValidElement);
    // 현재 경로(path)와 Route의 path 프롭스가 일치하는지 확인
    return routes.find((route) => (route.props as any).path === path);
  }, [children, path]);

  // 일치하는 경로가 없으면 NotFound를 보여주거나 null을 반환
  if (!activeRoute) return <h1>페이지를 찾을 수 없습니다 (404)</h1>;

  return cloneElement(activeRoute as ReactElement);
};