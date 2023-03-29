import {RadioGroup as Group, Radio} from 'react-radio-group'

const RadioGroup = ({name, defaultValue, onChange, list}) => {

  const styles = {
    radioGroup: {  
      "display": "inline-flex",
      "justify-content": "space-between"
    },
    radioButton: {
      "width": "5em",
      "text-align": "center",
      "line-height": "1.5em"
    }
  }

  return (
    <Group 
        name={name} 
        className='form-row btn-group btn-block'
        selectedValue={defaultValue} 
        style={styles.radioGroup}>
            {list.map((item, index) => {
                return (
                <>
                  <Radio className='btn-check' id={index} value={item} onChange={onChange} hidden/>
                  <label className='btn btn-secondary' for={index} style={styles.radioButton}>{item}</label>
                </>)
            })}
    </Group>
  )
}

export default RadioGroup

