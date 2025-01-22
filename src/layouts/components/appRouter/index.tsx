import { FunctionComponent, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '@/router';

type RenderRoutes = (routes: any[]) => React.ReactNode[];
/**
 * 渲染应用路由
 * @param routes
 * @param parentPath
 * @param setIsNotMenu
 */
const renderRoutes: RenderRoutes = (routes) =>
  routes.map((route, index: number) => {
    const { path, component: Component } = route;

    // if (redirect) {
    //   // 重定向
    //   return <Route key={index} path={currentPath} element={<Navigate to={redirect} replace />} />;
    // }

    if (Component) {
      // 有路由菜单
      return (
        <Route
          key={index}
          path={path}
          element={
            <>
              <Component />
            </>
          }
        />
      );
    }
    return null;
  });
const AppRouter: FunctionComponent = () => {
  return (
    <Suspense fallback='加载中'>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default AppRouter;
