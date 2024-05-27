/**
 * Changelog:
 * - 2024-04- - initial version (release of kth-style 10 public apps)
 */
import React from 'react'
import { MenuPanel } from '@kth/style'

export const MainMenuMobileDialog = React.forwardRef(({ children }, ref) => (
  <dialog className="kth-mobile-menu left" ref={ref}>
    <div className="kth-mobile-menu__navigation">
      <button className="kth-icon-button close">
        <span className="kth-visually-hidden">Close</span>
      </button>
    </div>
    <div className="mobile-menu__content">{children}</div>
  </dialog>
))
MainMenuMobileDialog.displayName = 'MainMenuMobileDialog'

export const MainMenu = ({ children, title, ancestorItem }) => {
  const mobileButtonRef = React.useRef()
  const mobileDialogRef = React.useRef()
  React.useEffect(() => {
    MenuPanel.initModal(mobileButtonRef.current, mobileDialogRef.current)
  }, [])

  const mobileId = 'kth-local-navigation-title--mobile'
  const desktopId = 'local-navigation-title'

  return (
    <>
      <nav className="kth-local-navigation--mobile" aria-labelledby={mobileId}>
        <button className="kth-button menu" id={mobileId} ref={mobileButtonRef}>
          <span>{title}</span>
        </button>
        <MainMenuMobileDialog ref={mobileDialogRef}>
          <a href={ancestorItem.href} className="kth-button back">
            {ancestorItem.label}
          </a>
          <h2>{title}</h2>
          {children}
        </MainMenuMobileDialog>
      </nav>

      <nav id="mainMenu" className="kth-local-navigation col" aria-labelledby={desktopId}>
        <a href={ancestorItem.href} className="kth-button back">
          {ancestorItem.label}
        </a>
        <h2 id={desktopId}>{title}</h2>
        {children}
      </nav>
    </>
  )
}
