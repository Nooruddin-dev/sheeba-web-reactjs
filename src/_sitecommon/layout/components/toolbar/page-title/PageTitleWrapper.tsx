
import {useLayout} from '../../../core'


const PageTitleWrapper = () => {
  const {config} = useLayout()
  if (!config.app?.pageTitle?.display) {
    return null
  }

  return <>hello</>;
}

export {PageTitleWrapper}
