
IDS = {
  ADD_NOTE_BUTTON: 'add-note-button',
  CLEAR_NOTES_BUTTON: 'clear-notes-button',
  NOTE_INPUT: 'note-text-input',
  NOTE_LIST: 'note-list'
}

CLASSES = {
  NOTE_ITEM: 'note-item',
}

EVENTS = {
  CLICK: 'click',
}

HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
}

MESSAGES = {
  NOTE_ADDED_SUCESS: 'Note has been added successfully',
  NOTE_ADD_FAIL: 'Note failed to add',
  NOTES_CLEARED: 'Notes have been cleared',
}

const BASE_URL = 'http://127.0.0.1:8888'

const API_CLIENT = {
  getAllNotes: async () => {
      const result = await fetch(`${BASE_URL}/notes`, { method: HTTP_METHODS.GET })
      .then( async (response) => {
        return await response.json().then(({ notes }) => {
          const formattedNotes = []
          notes.forEach(({ text, time_created }) => {
            formattedNotes.push({ text, timeCreated: formatTimeCreated(time_created)})
          })
          return formattedNotes
        })
      })
      .catch((error) => {
        console.log(error)
      })
    return result
  },
  addNote: async (newNote) => {
    const result = await fetch(`${BASE_URL}/addNote?noteText=${newNote}`, { method: HTTP_METHODS.POST })
    .then( async (response) => {
      return await response.json().then(({ new_note: data }) => {
          return { text: data.text, timeCreated: formatTimeCreated(data.time_created) }
        })
      })
      .catch((error) => {
        console.log(error)
      })
    return result
  },
  clearNotes: async () => {
    const result = await fetch(`${BASE_URL}/clearNotes`, { method: HTTP_METHODS.PUT })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
      })
    return result
  },
}

const createNoteDOMElement = ({ text, timeCreated }) => {
  const noteListItem = document.createElement('li');
  const timeCreatedElement = document.createElement('h6');
  const noteTextElement = document.createElement('h4');

  timeCreatedElement.innerText = timeCreated
  noteTextElement.innerText = text

  noteListItem.appendChild(timeCreatedElement)
  noteListItem.appendChild(noteTextElement)
  noteListItem.classList = CLASSES.NOTE_ITEM

  return noteListItem
}

const formatTimeCreated = (timeCreatedUnformatted) => {
  const timestamp = ''.concat(timeCreatedUnformatted)
  return timestamp.toLocaleUpperCase()
}

const addNoteButton = document.getElementById(IDS.ADD_NOTE_BUTTON)
addNoteButton.addEventListener(EVENTS.CLICK, async () => {
  const textArea = document.getElementById(IDS.NOTE_INPUT)
  const noteValue = textArea.value
  const newNote = await API_CLIENT.addNote(noteValue)
  const noteDOMItem = createNoteDOMElement(newNote)
  const noteList = document.getElementById(IDS.NOTE_LIST)
  noteList.appendChild(noteDOMItem)
})

const clearNotesButton = document.getElementById(IDS.CLEAR_NOTES_BUTTON)
clearNotesButton.addEventListener(EVENTS.CLICK, async () => {
  await API_CLIENT.clearNotes()
  const noteList = document.getElementById(IDS.NOTE_LIST)
  noteList.replaceChildren()
  alert(MESSAGES.NOTES_CLEARED)
})

const populateExistingNotes = async () => {
  const allNotes = await API_CLIENT.getAllNotes()
  const noteList = document.getElementById(IDS.NOTE_LIST)
  allNotes.forEach(note => {
    const noteDOMItem = createNoteDOMElement(note)
    noteList.appendChild(noteDOMItem)
  })
}

populateExistingNotes()
