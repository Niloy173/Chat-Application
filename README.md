# Chat-Application

This is a chat application project. Here you can find the real time chat environment so feel free to explore yourself.

# Feature

- Authentication system enabled
- Real-Time chat system configured
- Search engine optimised for user search
- Role Based user creation

# WorkFlow

This project is based on the real time chat system between one and another user.After user login (While checking all the field in authentication) an user can find his/her friend with a user search engine (developed quite efficiently and very much optimized) to add and starting chating & also the person has the right to delete the messages but don't have permission to **_create users_** by their own as **_admin will handle the user creation_**.so check the [file](https://github.com/Niloy173/Chat-Application/blob/master/admin.txt) in the root folder for login as admin Well, you might have the admin prevlige to create, update or delete access but as I have said, this is a fun project you can assume to make a room for yourself with your freinds and start chating. Have fun!!!!!!

In the future task, I will try to develop a system (Friend List) for each user which he/she added
through out the search engine will show up in his/her friend zone.

## Available Scripts

### `copy/paste this data in mongocompass or mongo atlas under your collection & (document: people) for initial admin pass`

![data](https://user-images.githubusercontent.com/63700841/209719800-e4f1d9b6-4739-4c92-bdf3-8636d7ba72cb.PNG)

```sh
{
  "_id": {
    "$oid": "636c135e83b8d19716e25abb"
  },
  "name": "Admin",
  "email": "admin@gmail.com",
  "mobile": "+8801881184444",
  "role": "admin",
  "password": "$2b$10$X1JcJ4yTPMNLUfNgM4NCgOq609AkNLin/9S/YBcOlVFplWAuBh.BK",
  "createdAt": {
    "$date": {
      "$numberLong": "1668026590922"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong": "1668026590922"
    }
  },
  "__v": 0,
  "avatar": {
    "data": {
      "$binary": {
        "base64": "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",
        "subType": "00"
      }
    },
    "contentType": "jpg"
  }
}
```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# check out

https://chatapp-j8xc.onrender.com/
