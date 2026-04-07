import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Mock data storage
const tables = new Map();
const documents = new Map();

// Initialize with sample data
const sampleTasks = [
  { id: "1", title: "Design homepage mockup", status: "done", priority: "high", assignee: "Alice", dueDate: "2024-01-15" },
  { id: "2", title: "Implement auth flow", status: "in_progress", priority: "high", assignee: "Bob", dueDate: "2024-01-20" },
  { id: "3", title: "Write API documentation", status: "todo", priority: "medium", assignee: "Charlie", dueDate: "2024-01-25" },
  { id: "4", title: "Setup CI/CD pipeline", status: "todo", priority: "low", assignee: "Diana", dueDate: "2024-01-30" },
  { id: "5", title: "Code review: feature-x", status: "in_progress", priority: "medium", assignee: "Alice", dueDate: "2024-01-18" },
];

const sampleProjects = [
  { id: "1", name: "WikiLive Core", status: "active", team: "Frontend", progress: 65 },
  { id: "2", name: "API Gateway", status: "active", team: "Backend", progress: 40 },
  { id: "3", name: "Mobile App", status: "planning", team: "Mobile", progress: 10 },
];

tables.set("tasks", {
  id: "tasks",
  name: "Tasks",
  columns: [
    { id: "title", name: "Title", type: "text" },
    { id: "status", name: "Status", type: "select", options: ["todo", "in_progress", "done"] },
    { id: "priority", name: "Priority", type: "select", options: ["low", "medium", "high"] },
    { id: "assignee", name: "Assignee", type: "text" },
    { id: "dueDate", name: "Due Date", type: "date" }
  ],
  records: sampleTasks,
  relations: [{ targetTable: "projects", field: "project", name: "Project" }]
});

tables.set("projects", {
  id: "projects",
  name: "Projects",
  columns: [
    { id: "name", name: "Name", type: "text" },
    { id: "status", name: "Status", type: "select", options: ["planning", "active", "completed", "archived"] },
    { id: "team", name: "Team", type: "text" },
    { id: "progress", name: "Progress", type: "number" }
  ],
  records: sampleProjects,
  relations: []
});

// === TABLES API ===

app.get("/api/tables", (req, res) => {
  const tableList = Array.from(tables.values()).map(t => ({
    id: t.id,
    name: t.name,
    recordCount: t.records.length
  }));
  res.json(tableList);
});

app.get("/api/tables/:id", (req, res) => {
  const table = tables.get(req.params.id);
  if (!table) {
    return res.status(404).json({ error: "Table not found" });
  }
  res.json(table);
});

app.post("/api/tables/:id/records", (req, res) => {
  const table = tables.get(req.params.id);
  if (!table) {
    return res.status(404).json({ error: "Table not found" });
  }
  const newRecord = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  table.records.push(newRecord);
  res.status(201).json(newRecord);
});

app.put("/api/tables/:id/records/:recordId", (req, res) => {
  const table = tables.get(req.params.id);
  if (!table) {
    return res.status(404).json({ error: "Table not found" });
  }
  const recordIndex = table.records.findIndex(r => r.id === req.params.recordId);
  if (recordIndex === -1) {
    return res.status(404).json({ error: "Record not found" });
  }
  table.records[recordIndex] = {
    ...table.records[recordIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(table.records[recordIndex]);
});

app.delete("/api/tables/:id/records/:recordId", (req, res) => {
  const table = tables.get(req.params.id);
  if (!table) {
    return res.status(404).json({ error: "Table not found" });
  }
  const recordIndex = table.records.findIndex(r => r.id === req.params.recordId);
  if (recordIndex === -1) {
    return res.status(404).json({ error: "Record not found" });
  }
  table.records.splice(recordIndex, 1);
  res.status(204).send();
});

// === DOCUMENTS API ===

app.get("/api/documents", (req, res) => {
  const docList = Array.from(documents.values()).map(d => ({
    id: d.id,
    title: d.title,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }));
  res.json(docList);
});

app.post("/api/documents", (req, res) => {
  const newDoc = {
    id: uuidv4(),
    title: req.body.title || "Untitled",
    content: req.body.content || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  documents.set(newDoc.id, newDoc);
  res.status(201).json(newDoc);
});

app.get("/api/documents/:id", (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: "Document not found" });
  }
  res.json(doc);
});

app.put("/api/documents/:id", (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: "Document not found" });
  }
  const updatedDoc = {
    ...doc,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  documents.set(req.params.id, updatedDoc);
  res.json(updatedDoc);
});

app.delete("/api/documents/:id", (req, res) => {
  if (!documents.has(req.params.id)) {
    return res.status(404).json({ error: "Document not found" });
  }
  documents.delete(req.params.id);
  res.status(204).send();
});

// === AI API ===

app.post("/api/ai/generate", (req, res) => {
  const { prompt } = req.body;
  setTimeout(() => {
    const responses = [
      `Based on your request, here's what I've generated:\n\n## Key Points\n\n1. **First important consideration**\n2. **Second key aspect**\n3. **Third crucial element**\n\n## Summary\n\nThis document covers the essential aspects of the topic and provides a foundation for further exploration.`,
      `# Generated Content\n\n## Overview\n\nThis section provides an overview of the topic.\n\n## Details\n\n- Item 1: Description\n- Item 2: Description\n- Item 3: Description\n\n## Next Steps\n\n1. Review the content\n2. Make adjustments as needed\n3. Share with team members`,
      `Here's a structured response:\n\n### Introduction\nThe purpose of this document is to provide comprehensive information.\n\n### Main Content\n\n- Key concept 1\n- Key concept 2\n- Key concept 3\n\n### Conclusion\nThis serves as a foundation for collaborative work.`
    ];
    res.json({
      result: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Add more details", "Create related table", "Generate summary"]
    });
  }, 500);
});

app.post("/api/ai/suggest", (req, res) => {
  res.json({
    suggestions: [
      { type: "link", text: "Connect to Projects table" },
      { type: "table", text: "Add related tasks" },
      { type: "format", text: "Add heading structure" },
      { type: "ai", text: "Generate more content" }
    ]
  });
});

app.post("/api/ai/summarize", (req, res) => {
  res.json({
    summary: "This document contains project information with 5 tasks and 3 team members.",
    keyPoints: ["2 tasks in progress", "1 high priority item", "3 upcoming deadlines"],
    wordCount: 150,
    readingTime: "1 min read"
  });
});

// === SEARCH API ===

app.get("/api/search", (req, res) => {
  const { q } = req.query;
  const results = { documents: [], tables: [], records: [] };
  
  documents.forEach((doc, id) => {
    if (doc.title.toLowerCase().includes((q || "").toLowerCase())) {
      results.documents.push({ id, title: doc.title });
    }
  });
  
  tables.forEach((table, id) => {
    if (table.name.toLowerCase().includes((q || "").toLowerCase())) {
      results.tables.push({ id, name: table.name });
    }
    table.records.forEach(record => {
      const matchField = table.columns.find(col => 
        record[col.id]?.toString().toLowerCase().includes((q || "").toLowerCase())
      );
      if (matchField) {
        results.records.push({
          tableId: id, tableName: table.name, recordId: record.id,
          field: matchField.name, value: record[matchField.id]
        });
      }
    });
  });
  
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
