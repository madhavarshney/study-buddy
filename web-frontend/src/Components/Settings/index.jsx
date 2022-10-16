import { useContext, useState, useEffect } from 'react'
import useSWR from 'swr'
import { TextField, Autocomplete, Button } from '@mui/material'

import fetcher from '../../utils/fetcher'
import { UserContext } from '../../utils/contexts'
import Shell from '../Shell'

const Settings = () => {
  const user = useContext(UserContext)
  // TODO: handle error and loading states
  const { data: allClasses, error: error2 } = useSWR(`/classes`, fetcher)
  const { data: classes, error } = useSWR(
    user ? `/users/${user.id}/classes` : null,
    fetcher
  )

  const [editedClasses, setEditedClasses] = useState(null)

  useEffect(() => {
    if (classes) {
      setEditedClasses(classes)
    }
  }, [classes])

  return (
    <Shell>
      {/* {user && user.name} */}

      <h3>Your Clases</h3>

      {allClasses && (
        <Autocomplete
          // multiple
          id="tags-standard"
          options={allClasses
            .filter(({ code }) =>
              // TODO: this is very hacky
              ['PHYSICS', 'ENGLISH', 'MATH', 'COMPSCI', 'PHYS'].includes(
                code.split(' ')[0]
              )
            )
            .filter(
              ({ code }) =>
                !editedClasses ||
                !editedClasses.find((cls) => cls.code === code)
            )}
          onChange={(event, option) => {
            console.log(option)
            if (option.code) {
              setEditedClasses([...editedClasses, option])
            }
          }}
          getOptionLabel={(option) => `${option.code}: ${option.title}`}
          // defaultValue={}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              // label="Multiple values"
              placeholder="Search for a class..."
            />
          )}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '1rem 0',
        }}
      >
        {editedClasses &&
          editedClasses.map(({ code, title }) => (
            <div
              key={code}
              style={{
                display: 'flex',
                flexDirection: 'row',
                background: 'white',
                alignItems: 'center',
                padding: '1rem',
              }}
            >
              <div style={{ paddingRight: '1rem', flex: 1 }}>
                {code}: {title}
              </div>
              <div>
                <Button
                  onClick={() => {
                    setEditedClasses(
                      editedClasses.filter((cls) => cls.code !== code)
                    )
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
      </div>

      <div>
        <Button
          variant="outlined"
          onClick={() => {
            fetch(`/users/${user.id}/classes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                classes: (editedClasses || []).map(({ code }) => code),
              }),
            })
          }}
        >
          Save
        </Button>
      </div>
    </Shell>
  )
}

export default Settings
