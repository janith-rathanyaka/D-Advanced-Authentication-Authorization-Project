import React, { useState } from 'react'
import {AppBar, Toolbar, Typography, Tab , Box, Tabs} from '@mui/material'
const Header = () => {
    const [value, setValue] = useState()
  return (
    <div>
        <AppBar>
            <Toolbar>
                <Typography variant='h3'>
                       MERN
                </Typography>
                <Box sx={{marginLeft: "auto"}}>
                    <Tabs value={1} textColor= "inherit">
                          <Tab label="Login" />
                          <Tab label="Signup" />
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Header;