import { title } from "process"
import {Chart} from "react-google-charts"
import { useUserStore} from "../../global/userState"

export default function ContributionsChart (){
    const {userScore} = useUserStore()
const data = [
    ['Contribution Type','Amount'],
    ['Created',userScore.create],
    ['Labeled',userScore.label],
    ['Reviewed',userScore.modify],
    ['Modified',userScore.review],
]
const data1 = [
    ['Contribution Type','Amount'],
    ['Created',20],
    ['Labeled',50],
    ['Reviewed',10],
    ['Modified',4],
]
const options = {
    title: "My Contribution Spread",
    pieHole:0.2,
    is3D: false
}
    return(
        <Chart
        chartType="PieChart" width={'100%'} height ={'40vh'} data={data} options={options}
        />
    )
}