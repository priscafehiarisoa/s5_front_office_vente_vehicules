import React, { useEffect, useState } from 'react';
import { Avatar, Button, Grid, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';
// import ChatList from './ChatMenu';
import ChatMenu from './ChatMenu';
import axios from 'axios';
import config from '../../config';
import TotalIncomeLightCard from '../../utils/TotalIncomeLightCard';
import { useTheme } from '@mui/material/styles';
import MessageComponent from './MessageComponent';
// import ChatMenu from './ChatMenu';

const ChatPrincipale = () => {
  // const colors=["",""]
  const [listUsers, setListUser] = useState([
    { nom: 'prisca', id: 1 },
    { nom: 'Jeddy', id: 2 },
    { nom: 'Jessy', id: 3 },
    { nom: 'Mendrika', id: 4 }
  ]);
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    nom: 'prisca',
    role: 'user'
  });
  const [sentMessage, setSentMessage] = useState(0);
  const [messageRecepteur, setMessageRecepteur] = useState({ id: '2', nom: 'Jessy', role: 'user' });

  const [conversation, setConversation] = useState([]);

  const link = `${config.http}://${config.host}:${config.port}`;
  const theme = useTheme();

  useEffect(() => {
    const getDatas = async () => {
      const datas = await axios.get(link + `/getSerndersName/${currentUser.id}`);

      setListUser(datas.data.donnee);
      if (messageRecepteur === {} && listUsers.length > 0) {
        setMessageRecepteur(listUsers[0]);
      }

      const postconversation = await axios.post(link + `/getConversation`, {
        idExpediteur: currentUser.id,
        idRecepteur: messageRecepteur.id
      });
      setConversation(postconversation.data.donnee);
    };
    getDatas();
  }, [sentMessage, messageRecepteur]);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState({});

  // const handleChangeConversation = (user) => {
  //   setMessageRecepteur(user);
  // };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    try {
      if (messages.contenuMesssage !== '') {
        setMessages({ contenuMesssage: input, idExpediteur: currentUser.id, idRecepteur: messageRecepteur.id });
        // You can add logic here to handle the chatbot's response
        console.log('here : ' + JSON.stringify(messages));
        const sendMessage = await axios.post(link + '/SendMessage', messages);
        console.log(sendMessage.data);
        setSentMessage(sentMessage + 1);
        setMessages({});
        // setInput('');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeConversation = (user) => {
    // setMessageRecepteur(user);
    console.log(user);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} m={0}>
        <Paper
          elevation={3}
          style={{
            padding: '3% 3% 3%',
            maxWidth: '100%',
            display: 'flex',
            margin: '2% auto',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {listUsers?.map((userMessage) => (
            <TotalIncomeLightCard
              key={userMessage.id}
              onClick={() => {
                handleChangeConversation(userMessage.id);
              }}
              texte={userMessage.nom}
              style={{ margin: '5%' }}
            ></TotalIncomeLightCard>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8} m={0}>
        <Paper
          elevation={3}
          style={{
            padding: '20px',
            maxWidth: '100%',
            maxHeight: '700px',
            minHeight: '700px',
            margin: '1% auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">Prisca</Typography>
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              // marginBottom: '1%',
              width: '100%'
            }}
          >
            <List>
              {conversation.map((message, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  variant="rounded"
                  style={{
                    display: 'flex',
                    margin: '0%',
                    // padding: '3%',
                    width: 'auto',
                    borderColor: theme.palette.secondary.main,
                    marginRight: message.idExpediteur === currentUser.id ? '0%' : '45%',
                    marginLeft: message.idExpediteur === currentUser.id ? '60%' : '0%',
                    // maxWidth: '45%',
                    flexDirection: 'column',
                    alignItems: message.idExpediteur === currentUser.id ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {message.idExpediteur !== currentUser.id && <Avatar style={{ marginRight: '8px' }}>B</Avatar>}
                    <MessageComponent
                      style={{}}
                      message={message.contenuMesssage}
                      date={message.dateEnvoiMessage}
                      isCurrentUser={message.idExpediteur === currentUser.id}
                    />
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '8px',
              width: '100%'
            }}
          >
            <TextField
              label="écrivez votre message ici"
              variant="outlined"
              fullWidth
              value={input}
              onChange={handleInputChange}
              style={{ flexGrow: 1, marginRight: '8px' }}
            />
            <Button variant="contained" color="secondary" onClick={handleSendMessage}>
              envoyer
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default ChatPrincipale;
