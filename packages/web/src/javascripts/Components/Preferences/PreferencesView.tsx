import RoundIconButton from '@/Components/Button/RoundIconButton'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { PreferencesSessionController } from './Controller/PreferencesSessionController'
import PreferencesCanvas from './PreferencesCanvas'
import { PreferencesProps } from './PreferencesProps'
import { useAndroidBackHandler } from '@/NativeMobileWeb/useAndroidBackHandler'
import Modal, { ModalAction } from '../Modal/Modal'
import { classNames } from '@standardnotes/snjs'
import { useAvailableSafeAreaPadding } from '@/Hooks/useSafeAreaPadding'
import { MutuallyExclusiveMediaQueryBreakpoints, useMediaQuery } from '@/Hooks/useMediaQuery'
import Icon from '../Icon/Icon'

const PreferencesView: FunctionComponent<PreferencesProps> = ({ application, closePreferences }) => {
  const menu = useMemo(
    () => new PreferencesSessionController(application, application.enableUnfinishedFeatures),
    [application],
  )

  useEffect(() => {
    menu.selectPane(application.preferencesController.currentPane)
  }, [menu, application.preferencesController.currentPane])

  const isMobileScreen = useMediaQuery(MutuallyExclusiveMediaQueryBreakpoints.sm)

  const addAndroidBackHandler = useAndroidBackHandler()

  useEffect(() => {
    const removeListener = addAndroidBackHandler(() => {
      closePreferences()
      return true
    })
    return () => {
      if (removeListener) {
        removeListener()
      }
    }
  }, [addAndroidBackHandler, closePreferences])

  const { hasTopInset } = useAvailableSafeAreaPadding()

  const modalActions = useMemo(
    (): ModalAction[] => [
      {
        label: (
          <span className="flex items-center">
            <Icon type="chevron-left" size="large" />
            Back
          </span>
        ),
        type: 'primary',
        mobileSlot: 'left',
        onClick: closePreferences,
      },
    ],
    [closePreferences],
  )

  return (
    <Modal
      close={closePreferences}
      title="Preferences"
      className="flex flex-col"
      disableCustomHeader={isMobileScreen}
      actions={modalActions}
      customFooter={<></>}
    >
    </Modal>
  )
}

export default observer(PreferencesView)
