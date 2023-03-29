import {
  AreaChart as Chart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const AreaChart = ({data}) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <Chart data={data} margin={{top: 50}}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type='monotone' dataKey='count' fill='#2cb1bc' />
      </Chart>
    </ResponsiveContainer>
  )
}

export default AreaChart
