import { useContext } from 'react'
import useSWR from 'swr'

import fetcher from '../../utils/fetcher'
import { UserContext } from '../../utils/contexts'
import Shell from '../Shell'
import Class from './Class'

const Settings = () => {
  const user = useContext(UserContext)
  // TODO: handle error and loading states
  const { data: classes, error } = useSWR(
    user ? `/users/${user.id}/classes` : null,
    fetcher
  )

  return (
    <Shell>
      {user && user.name}

      {classes.map(({ code, title }) => {
        return <Class code={code} title={title} />
      })}
    </Shell>
  )
}

export default Settings
