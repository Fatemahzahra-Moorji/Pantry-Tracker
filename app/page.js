'use client'
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"
import {Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Grid, IconButton, CssBaseline} from "@mui/material"
import {ThemeProvider, createTheme} from "@mui/material/styles"
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
// import '../app/globals.css'

const theme = createTheme({
  palette: {
    primary: {
      main: "#3d5a80",
    },
    secondary: {
      main: "#98c1d9",
    },
    background: {
      default: "#e0fbfc",
    },
    error: {
      main: "#ee6c4d",
    },
    text: {
      primary: "#293241",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h6: {
      fontSize: "1.2rem"
    },
    body1: {
      coloe: "#293241",
    },
    button: {
      fontWeight: 700,
    },
  },
})

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')


  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setPantry(pantryList)
    //console.log(pantryList)
  }
  
  const addItem = async (item, category) => {
    if (!category) {
      category = 'uncategorized'
    }

    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1, category})
    } else {
      await setDoc(docRef, {quantity: 1, category})
    }

    await updatePantry()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity, category} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1, category: category || 'uncategorized'})
      }
    }

    await updatePantry()
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const filteredPantry = pantry.filter(({name, category}) => {
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{pt: 4}}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Pantry Tracker
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{mb: 4}}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{backgroundColor: "#e0fbfc"}}
          />
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{backgroundColor: "#e0fbfc"}}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Desserts">Desserts</MenuItem>
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Uncategorized">Uncategorized</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={4}>
          {filteredPantry.map(({name, quantity, category}) => (
            <Grid item xs={12} md={6} key={name}>
              <Box
                sx={{
                  backgroundColor: "#e0fbfc",
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" color="primary">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1">Category: {category}</Typography>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">{quantity}</Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => addItem(name, category)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() =>removeItem(name)}>
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
        </Grid>
      ))}
    </Grid>

    <Button
      variant="contained"
      color="secondary"
      fullWidth
      sx={{mt: 4}}
      onClick={() => setOpen(true)}
    >
      Add New Item
    </Button>

    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          type="text"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          sx={{mb: 3}}
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            <MenuItem value="Desserts">Desserts</MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Vegetables">Vegetables</MenuItem>
            <MenuItem value="Dairy">Dairy</MenuItem>
            <MenuItem value="Uncategorized">Uncategorized</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="error">
          Cancel
        </Button>
        <Button
          onClick={() => {
            addItem(itemName, category);
            setItemName("")
            setCategory("")
            setOpen(false)
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  </Container>
</ThemeProvider>
)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
}  
