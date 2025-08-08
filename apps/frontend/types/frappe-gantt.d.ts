declare module 'frappe-gantt' {
  interface GanttTask {
    id: string
    name: string
    start: string
    end: string
    progress: number
    dependencies?: string
  }

  interface GanttOptions {
    view_mode?: string
    date_format?: string
    on_click?: (task: GanttTask) => void
    on_date_change?: (task: GanttTask, start: Date, end: Date) => void
    on_progress_change?: (task: GanttTask, progress: number) => void
    on_view_change?: (mode: string) => void
    custom_popup_html?: (task: GanttTask) => string
  }

  class Gantt {
    constructor(wrapper: Element, tasks: GanttTask[], options?: GanttOptions)
  }

  export = Gantt
}
