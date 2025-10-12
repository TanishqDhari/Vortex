export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "published":
    case "resolved":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "inactive":
    case "draft":
    case "open":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "in progress":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}
