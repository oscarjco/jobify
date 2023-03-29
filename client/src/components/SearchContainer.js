import { FormRow, FormRowSelect, RadioGroup } from '.'
import { useAppContext } from '../context/AppContext'
import Wrapper from '../assets/wrappers/SearchContainer'

const SearchContainer = () => {
  const {
    isLoading,
    search,
    job,
    handleSearch,
    clearFilters,
  } = useAppContext()

  const onSearch = (e) => {
    if(isLoading) return

    const {name, value} = e.target

    handleSearch({name, value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    clearFilters()
  }

  return (
    <Wrapper>
      <form className='form'>
        <h4>Search</h4>
        <div className='form-center'>
          <FormRow name='text' 
              type='text' 
              value={search.text} 
              onChange={onSearch} />
          <FormRowSelect name='status' 
              labelName='job status'
              value={search.status}
              onChange={onSearch}
              list={['all', ...job.statusOptions]} />
          <FormRowSelect name='type' 
              labelName='job type' 
              value={search.type} 
              onChange={onSearch} 
              list={['all', ...job.typeOptions]} />
          <RadioGroup name='sort'
              value={search.sort}
              onChange={onSearch}
              list={search.sortOptions} />
          <button className='btn btn-block btn-danger'
              disabled={isLoading}
              onClick={handleSubmit}>
                clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer
