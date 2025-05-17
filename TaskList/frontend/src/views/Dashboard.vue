<template>
  <div class="dashboard-container">
    <!-- Header -->
    <header class="dashboard-header">
      <h1>My Notes Dashboard</h1>
      <button @click="logout" class="btn btn-logout">Logout</button>
    </header>

    <!-- Logout Message -->
    <div v-if="logoutMessage" class="logout-message">
      {{ logoutMessage }}
    </div>

    <!-- Main content divided in three columns -->
    <div class="content">
      <!-- Left Column: Create Note, Global Filters and Tag Cards -->
      <div class="left-column">
        <div class="create-note">
          <h2>Create Note</h2>
          <form @submit.prevent="createNote">
            <div class="form-group">
              <label for="new-title">Title:</label>
              <input
                id="new-title"
                v-model="newTitle"
                type="text"
                placeholder="Enter title"
                required
              />
            </div>
            <div class="form-group">
              <label for="new-content">Content:</label>
              <textarea
                id="new-content"
                v-model="newContent"
                placeholder="Enter content"
                required
              ></textarea>
            </div>
            <!-- Tag input field -->
            <div class="form-group">
              <label for="new-tag">Tag:</label>
              <input
                id="new-tag"
                v-model="newTag"
                type="text"
                placeholder="Enter tag"
              />
            </div>
            <button type="submit" class="btn btn-primary">Create Note</button>
            <p v-if="createMessage" class="message">{{ createMessage }}</p>
          </form>
        </div>
        <!-- Tag Cards section -->
        <div class="tag-cards-section">
          <h3>Existing Tags:</h3>
          <div class="tag-cards">
            <!-- Al hacer clic en la tarjeta, se aplica el filtro -->
            <span
              v-for="tag in uniqueTags"
              :key="tag"
              class="tag-card"
              @click="applyTagFilter(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <!-- Global Search Filters -->
        <div class="active-search">
          <input
            v-model="activeSearch"
            type="text"
            placeholder="Search by title or content..."
          />
          <input
            v-model="activeTagSearch"
            type="text"
            placeholder="Filter by tag..."
          />
        </div>
      </div>

      <!-- Middle Column: Active Notes -->
      <div class="middle-column">
        <h2>Active Notes</h2>
        <div v-if="filteredActiveNotes.length === 0">
          <p>No active notes found that match the search.</p>
        </div>
        <div class="notes-list">
          <div class="note-card" v-for="note in filteredActiveNotes" :key="note.id">
            <!-- Inline Edit Mode -->
            <div v-if="editingNoteId === note.id" class="note-edit">
              <input
                type="text"
                v-model="editingTitle"
                class="edit-title"
                placeholder="Edit title"
              />
              <textarea
                v-model="editingContent"
                class="edit-content"
                placeholder="Edit content"
              ></textarea>
              <input
                type="text"
                v-model="editingTag"
                class="edit-tag"
                placeholder="Edit tag"
              />
              <div class="edit-buttons">
                <button @click="saveEdit(note.id)" class="btn btn-success">Save</button>
                <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
              </div>
            </div>
            <!-- View Mode -->
            <div v-else class="note-view">
              <h3>{{ note.title }}</h3>
              <p>{{ note.content }}</p>
              <p v-if="note.tag" class="note-tag">Tag: {{ note.tag }}</p>
              <div class="note-actions">
                <button @click="startEdit(note)" class="btn btn-warning">Edit</button>
                <button @click="deleteNote(note)" class="btn btn-danger">Delete</button>
                <button @click="toggleArchive(note)" class="btn btn-info">
                  {{ note.archived === 't' ? "Restore" : "Archive" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Archived Notes with exclusive filter -->
      <div class="right-column">
        <h2>Archived Notes</h2>
        <!-- Exclusive Filter for Archived Notes -->
        <div class="filter-archived">
          <input 
            v-model="archivedSearch" 
            type="text" 
            placeholder="Filter archived notes..." 
          />
        </div>
        <div v-if="filteredArchivedNotes.length === 0">
          <p>No archived notes found.</p>
        </div>
        <div class="notes-list">
          <div class="note-card" v-for="note in filteredArchivedNotes" :key="note.id">
            <div class="note-view">
              <h3>{{ note.title }}</h3>
              <p>{{ note.content }}</p>
              <p v-if="note.tag" class="note-tag">Tag: {{ note.tag }}</p>
              <div class="note-actions">
                <button @click="deleteNote(note)" class="btn btn-danger">Delete</button>
                <button @click="toggleArchive(note)" class="btn btn-info">Restore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      notes: [],
      newTitle: "",
      newContent: "",
      newTag: "",
      createMessage: "",
      activeSearch: "",
      activeTagSearch: "",
      archivedSearch: "",
      editingNoteId: null,
      editingTitle: "",
      editingContent: "",
      editingTag: "",
      logoutMessage: ""
    };
  },
  computed: {
    // Active notes filtered by global search inputs
    filteredActiveNotes() {
      const searchTerm = this.activeSearch.trim().toLowerCase();
      const tagTerm = this.activeTagSearch.trim().toLowerCase();
      return this.notes.filter(note => {
        const isActive = note.archived === 'f';
        const matchesGeneral =
          searchTerm === "" ||
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm);
        const matchesTag =
          tagTerm === "" ||
          (note.tag && note.tag.toLowerCase().includes(tagTerm));
        return isActive && matchesGeneral && matchesTag;
      });
    },
    // Archived notes filtered using the exclusive archived filter
    filteredArchivedNotes() {
      const archivedTerm = this.archivedSearch.trim().toLowerCase();
      return this.notes.filter(note => {
        const isArchived = note.archived === 't';
        const matchesArchived = 
          archivedTerm === "" ||
          note.title.toLowerCase().includes(archivedTerm) ||
          note.content.toLowerCase().includes(archivedTerm) ||
          (note.tag && note.tag.toLowerCase().includes(archivedTerm));
        return isArchived && matchesArchived;
      });
    },
    // Compute unique non-empty tags from the existing notes
    uniqueTags() {
      const tagSet = new Set();
      this.notes.forEach(note => {
        if (note.tag && note.tag.trim() !== '') {
          tagSet.add(note.tag.trim());
        }
      });
      return Array.from(tagSet);
    }
  },
  methods: {
    async createNote() {
      try {
        await axios.post("/notes", {
          title: this.newTitle,
          content: this.newContent,
          tag: this.newTag
        });
        this.createMessage = "Note created successfully";
        this.newTitle = "";
        this.newContent = "";
        this.newTag = "";
        this.fetchNotes();
      } catch (error) {
        console.error("Error creating note:", error);
        this.createMessage = "Error creating note";
      }
    },
    async fetchNotes() {
      try {
        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("/notes?archived=false"),
          axios.get("/notes?archived=true")
        ]);
        this.notes = [...activeResponse.data, ...archivedResponse.data];
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    },
    startEdit(note) {
      this.editingNoteId = note.id;
      this.editingTitle = note.title;
      this.editingContent = note.content;
      this.editingTag = note.tag || "";
    },
    async saveEdit(noteId) {
      try {
        await axios.put(`/notes/${noteId}`, {
          title: this.editingTitle,
          content: this.editingContent,
          tag: this.editingTag
        });
        this.editingNoteId = null;
        this.fetchNotes();
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    cancelEdit() {
      this.editingNoteId = null;
      this.editingTitle = "";
      this.editingContent = "";
      this.editingTag = "";
    },
    async deleteNote(note) {
      try {
        await axios.delete(`/notes/${note.id}`);
        this.fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    async toggleArchive(note) {
      try {
        await axios.patch(`/notes/${note.id}/archive`);
        this.fetchNotes();
      } catch (error) {
        console.error("Error toggling archive status:", error);
      }
    },
    // Método para aplicar el filtro por tag al hacer click en una tarjeta
    applyTagFilter(tag) {
      this.activeTagSearch = tag;
    },
    logout() {
      localStorage.removeItem("token");
      this.logoutMessage = "Logged out, redirecting to login...";
      setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    }
  },
  mounted() {
    this.fetchNotes();
  }
};
</script>

<style scoped>
/* Main container */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Content container with three columns */
.content {
  display: flex;
  gap: 1rem;
  max-height: 80vh;
}

/* Columns with individual scroll */
.left-column,
.middle-column,
.right-column {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.left-column {
  flex: 0 0 30%;
  max-height: 80vh;
}
.middle-column {
  flex: 0 0 40%;
  max-height: 80vh;
}
.right-column {
  flex: 0 0 30%;
  max-height: 80vh;
}

/* Tag cards section in left column */
.tag-cards-section {
  margin-top: 1rem;
}
.tag-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag-card {
  background-color: #e0e0e0;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Filter input for archived notes */
.filter-archived {
  margin-bottom: 0.75rem;
}

/* Inputs and textareas */
input[type="text"],
textarea {
  width: 100%;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Section headings */
h2,
h3 {
  margin-bottom: 0.75rem;
}

/* Note card styles */
.note-card {
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Buttons */
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin: 0.25rem;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-success {
  background-color: #28a745;
  color: #fff;
}
.btn-warning {
  background-color: #ffc107;
  color: #000;
}
.btn-danger {
  background-color: #dc3545;
  color: #fff;
}
.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

/* Messages */
.logout-message,
.message {
  text-align: center;
  margin-top: 0.5rem;
  font-weight: bold;
}
</style>