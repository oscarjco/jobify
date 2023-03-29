import { useAppContext } from '../context/AppContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
  const {totalPages, currentPage, changePage} = useAppContext()

  const pages = Array.from(
    {length: totalPages}, 
    (_, index) => {return index + 1}
    );

  const prevPage = () => {

  }

  const nextPage = () => {

  }

  return (
    <Wrapper>
      <button className='prev-btn' onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
        <HiChevronDoubleLeft /> prev
      </button>
      <div className='btn-container'>
        {pages.map((page) => {
          return (
            <button className={page === currentPage ? 'pageBtn active' : 'pageBtn'} 
                key={page} 
                onClick={() => changePage(page)}>
                  {page}
            </button>
          )
        })}
      </div>
      <button className='prev-btn' onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
        <HiChevronDoubleRight /> next
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer
