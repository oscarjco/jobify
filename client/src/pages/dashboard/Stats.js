import { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { StatsContainer, Loading, ChartsContainer } from '../../components'

const Stats = () => {
  const {showStats, isLoading, monthlyApplications} = useAppContext()

  useEffect(() => {showStats()}, []);

  return isLoading ? <Loading center /> : (
    <>
    <h1>Thanks for watching!!!</h1>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  )
}

export default Stats
