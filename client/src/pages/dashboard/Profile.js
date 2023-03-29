import {useState} from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/AppContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const Profile = () => {
  const {user, showAlert, displayAlert, updateUser, isLoading} = useAppContext()
  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [lastName, setLastName] = useState(user?.lastName)
  const [location, setLocation] = useState(user?.location)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name || !email || !lastName || !location) {
      displayAlert()
      return
    }

    updateUser({name, email, lastName, location})
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>Profile</h3>
        {showAlert && <Alert />}

        <div className='form-center'>
          <FormRow type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormRow type="text" name="lastName" labelName="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <FormRow type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormRow type="text" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile
