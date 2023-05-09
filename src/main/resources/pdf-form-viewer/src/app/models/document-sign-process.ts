export interface DocumentSignProcess {
  process_type: string
  id: string
  self: string
  tasks: Tasks
  documents: Document[]
}

export interface Tasks {
  pending: Pending[]
}

export interface Pending {
  type: string
  id: string
  url: string
}

export interface Document {
  id: string
  url: string
  content: string
}
