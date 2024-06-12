import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './header/Header';
// import Customizer from './customizer/Customizer';
import Sidebar from './sidebars/vertical/Sidebar';
import HorizontalHeader from './header/HorizontalHeader';
import HorizontalSidebar from './sidebars/horizontal/HorizontalSidebar';
// import NotificationP from './notification/NotificationP';

const FullLayout = () => {
  const customizerToggle = useSelector((state) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);
  const isFixedSidebar = useSelector((state) => state.customizer.isSidebarFixed);
  const queryClient = new QueryClient();
  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''}`}
      >
        <QueryClientProvider client={queryClient}>
          {/******** Sidebar **********/}
          {LayoutHorizontal ? (
            ''
          ) : (
            <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
              <Sidebar />
            </aside>
          )}
          {/********Content Area**********/}

          <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''}`}>
            {/********header**********/}
            {LayoutHorizontal ? <HorizontalHeader /> : <Header />}
            {LayoutHorizontal ? <HorizontalSidebar /> : ''}
            {/********Middle Content**********/}
            {/* <NotificationP /> */}
            <Container fluid className="p-4 boxContainer">
              <div className={isFixedSidebar && LayoutHorizontal ? 'HsidebarFixed' : ''}>
                <Outlet />
              </div>
              {/* <Customizer className={customizerToggle ? 'showCustomizer' : ''} /> */}
              {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ''}
            </Container>
          </div>
        </QueryClientProvider>
      </div>
    </main>
  );
};

export default FullLayout;
