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

  /* return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      //bgcolor="#f7f7f7"
      //padding={4}
      gap={2} 
      className="animated-background"
      sx={{
        bgcolor: '#e3f2fd', p: 4
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={3}
          //border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" color="primary">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              label="Item Name"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select 
              labelId="category-label"
              value={category}
              label="Category"
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
            <Button 
              variant="outlined"
              color="primary"
              onClick={() => {
                addItem(itemName, category)
                setItemName('')
                setCategory('')
                handleClose()
              }}
              >
                Add
              </Button>
          </Stack>
        </Box>    
      </Modal>
      <Stack direction="row" spacing={2} width="100%" maxWidth="800px" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{mr: 2}}
        />
        <FormControl sx={{minWidth: 200}}>
        <InputLabel id="category-filter-label">Filter by Category</InputLabel>
        <Select
          labelId="category-filter-label"
          value={selectedCategory}
          label="Filter by Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
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

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{alignSelf: 'center', bgcolor: '#1976d2'}}
      >
        Add New Item
      </Button>
      
      <Box border="1px solid #ddd" borderRadius={4} overflow="hidden" width="100%" maxWidth="800px" bgcolor="white">
        <Box 
          width="100%"
          height="100px"
          bgcolor="#1976d2"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px 4px 0 0"
        >
          <Typography variant="h2" color="#fff">
            Pantry Items
          </Typography>
        </Box>
      <Stack width="100%" height="300px" spacing={2} padding={2} sx={{overflowY: 'auto'}}>
        {filteredPantry.map(({name, quantity, category}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            borderRadius={4}
            padding={5}
            boxShadow={1}
          >
            <Stack>
            <Typography variant="h4" color="#333">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="subtitle1" color="#555">
              Category: {category}
            </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton color="primary" onClick={() => addItem(name, category)}>
                <AddIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => removeItem(name)}>
                <RemoveIcon />
              </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  )
}*/
