import { Card, CardContent } from "@/components/ui/card"

export default function StatsGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat: any, i: number) => {
        const Icon = stat.icon
        return (
          <Card
            key={i}
            className="bg-[linear-gradient(-45deg,#192145,#210e17)] border border-gray-800 shadow-lg hover:shadow-amber-600/20 transition"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-green-400 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className="bg-amber-600/20 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
