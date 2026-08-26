import processes from '../../data/missionProcesses.json'
import CrewedOrbitProcess from './CrewedOrbitProcess'
import HistoricalProcess from './HistoricalProcess'
import LunarProcess from './LunarProcess'
import MarsProcess from './MarsProcess'
import StationAssemblyProcess from './StationAssemblyProcess'

const processLayouts = {
  historical: HistoricalProcess,
  crewedOrbit: CrewedOrbitProcess,
  lunar: LunarProcess,
  mars: MarsProcess,
  stationAssembly: StationAssemblyProcess,
}

export default function MissionProcess({ hall }) {
  const process = processes.find((item) => item.id === hall.id)
  if (!process) return null
  const ProcessLayout = processLayouts[process.layout]
  return ProcessLayout ? <ProcessLayout process={process} /> : null
}
