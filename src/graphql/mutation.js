import gql from "graphql-tag"

export const CHECK_EMAIL = gql`
    mutation check($email: String, $accessCode: String!, $uid: String) {
        checkEmail(email:$email, accessCode: $accessCode, uid: $uid) {
          valid
          isBanned
        }
    }
`

export const SEARCH_USER = gql`
query searchUser($search: String, $perPage: Int, $page: Int, $filters: RequestFilterUser, $sortBy: String, $status: String, $useExport: Boolean ) {
  searchUser(search: $search, perPage: $perPage, page: $page, filters: $filters, sortBy: $sortBy, status: $status, useExport: $useExport) {
    page
    nbHits
    nbPages
    hitsPerPage
    processingTimeMS
    __typename
    hits {
      id
      username
      fullName
      email
      mobileNumber
      gender
      dob
      joinDate
      profilePicture
      interest
      theme
      status
      __typename
    }
  }
}
`

export const SEARCH_POST = gql`
query searchPost(
  $search: String
  $perPage: Int
  $page: Int
  $range: Float
  $sortBy: String
  $hasReported: Boolean
  $location: String
  $filters: RequestFilter,
  $useExport: Boolean
){
  searchPosts(
    search: $search
    perPage: $perPage
    page: $page
    range: $range
    sortBy: $sortBy
    hasReported: $hasReported
    filters: $filters
    location: $location
    useExport: $useExport
  ){
    hits{
      id
        owner
        text
        media {
          content
          type
        }
        createdAt
        room
        location {
          lat
          lng
          detail {
            city
            country
            district
            formattedAddress
            postCode
            state
            streetName
            subDistrict
          }
        }
        rank
        likeCount
        commentCount
        repostCount
        status {
          active
          flags
          takedown
          }
        likes {
          id
          owner
          createdAt
          colorCode
          displayName
          displayImage
        }
        comments {
          id
          createdAt
          owner
          textContent
          photoProfile
          photo
          displayName
          displayImage
          colorCode
          reply {
            id
            username
          }
        }
        muted {
          id
          owner
          postId
          createdAt
        }
        subscribe {
          postId
          owner
          createdAt
          displayName
          displayImage
          colorCode
        }
    }
    page
    nbHits
    nbPages
    hitsPerPage
    processingTimeMS
  }
}`

export const SEARCH_POST_EXPORT = gql`
query searchPostExport(
  $search: String
  $perPage: Int
  $page: Int
  $range: Float
  $sortBy: String
  $hasReported: Boolean
  $location: String
  $filters: RequestFilter,
  $useExport: Boolean
){
  searchPosts(
    search: $search
    perPage: $perPage
    page: $page
    range: $range
    sortBy: $sortBy
    hasReported: $hasReported
    filters: $filters
    location: $location
    useExport: $useExport
  ){
    hits{
      id
        owner
        text
        media {
          content
          type
        }
        createdAt
        room
        location {
          lat
          lng
          detail {
            city
            country
            district
            formattedAddress
            postCode
            state
            streetName
            subDistrict
          }
        }
        rank
        likeCount
        commentCount
        repostCount
        status {
          active
          flags
          takedown
          }
        likes {
          id
          owner
          createdAt
          colorCode
          displayName
          displayImage
        }
        comments {
          id
          createdAt
          owner
          textContent
          photoProfile
          photo
          displayName
          displayImage
          colorCode
          reply {
            id
            username
          }
        }
        muted {
          id
          owner
          postId
          createdAt
        }
        subscribe {
          postId
          owner
          createdAt
          displayName
          displayImage
          colorCode
        }
    }
    page
    nbHits
    nbPages
    hitsPerPage
    processingTimeMS
  }
}`

export const CHANGE_USER_STATUS = gql`
mutation ChangeUserStatus($status: String!, $username: String!) {
   changeUserStatus(status:$status, username:$username) {
    email
    id
    status
    message
  }
}`

export const DELETE_ROOM = gql`
mutation DeleteRoom($roomId: ID!) {
  deleteRoom(roomId: $roomId) {
    id
    status
    message
  }
}`
export const DELETE_THEME = gql`
mutation deleteThemeById($id: ID!) {
  deleteThemeById(id: $id) {
    id
    status
    message
  }
}`

export const CHANGE_POST_STATUS = gql`
mutation ChangePostStatus($active: Boolean, $flags: [String], $postId: String, $takedown:Boolean, $deleted: Boolean){
  setStatusPost(active: $active, flags: $flags, takedown: $takedown, postId: $postId, deleted: $deleted) {
    	id
      message
    	media {
        type
      }
      status {
        active
        flags
        takedown
        deleted
      }
      comments{
        displayName
      }
      message
  }
}`

export const CREATE_NEW_THEMES = gql`
mutation CreateNewTheme($name: String, $colors: [Colors], $adjective: [Adjective], $nouns: [Nouns]) {
  createNewTheme(name: $name, colors: $colors, adjective: $adjective, nouns: $nouns) {
    name
    id
    colors {
      name
      hex
      id
    }
    nouns {
      avatarUrl
      name
      id
    }
    isDeleted
    isActive
    adjective {
      id
      name
    }
  }
}
`

export const UPDATE_THEMES = gql`
mutation UpdateNewTheme($id: ID, $name: String, $colors: [Colors], $adjective: [Adjective], $nouns: [Nouns], $isDeleted: Boolean, $isActive: Boolean) {
  updateThemesById(id: $id, name: $name, colors: $colors, adjective: $adjective, nouns: $nouns, isDeleted: $isDeleted, isActive: $isActive) {
    name
    id
    colors {
      name
      hex
    }
    nouns {
      avatarUrl
      name
    }
    isDeleted
    isActive
    adjective {
      id
      name
    }
  }
}
`

export const SET_STATUS_ADMIN = gql`
  mutation SetStatusAdmin($adminId: ID, $isActive: Boolean, $isBanned: Boolean) {
    setStatusAdmin(adminId: $adminId, isActive: $isActive, isBanned: $isBanned) {
      id
      name
      level
      isBanned
      isActive
    }
  }
`

export const SEARCH_ADMINS = gql`
  query GetAdmins($page: Int, $perPage: Int) {
    getAdmin(page: $page, perPage: $perPage) {
      hits {
        id
        name
        email
        level
        isActive
        isBanned
      }
      nbHits
      nbPages
    }
  }
`

export const CREATE_ROOM = gql`
  mutation CreateRoom($roomName: String, $description: String, $startingDate: String, $tillDate: String, $displayPicture: String, $location: LatLongWithRangeInput, $range: Int) {
    createRoom(roomName: $roomName, description: $description, startingDate: $startingDate, tillDate: $tillDate, displayPicture: $displayPicture, location: $location, range: $range)
  }
`

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($isDeactive: Boolean, $roomId: ID, $roomName: String, $description: String, $startingDate: String, $tillDate: String, $displayPicture: String, $location: LatLongWithRangeInput, $range: Int) {
    updateRoom(isDeactive: $isDeactive, roomId: $roomId, roomName: $roomName, description: $description, startingDate: $startingDate, tillDate: $tillDate, displayPicture: $displayPicture, location: $location, range: $range) {
      id
      roomName
      address
      isDeactive
      tillDate
      location {
        range
        lat
        lng
        detail {
          formattedAddress
        }
      }
      startingDate
      displayPicture
      createdBy
      createdBy
    }
  }
`

export const CHANGE_COMMENT_STATUS = gql`
  mutation ChangeCommentStatus($idComment: ID, $active: Boolean, $takedown: Boolean, $deleted: Boolean) {
    setStatusComment(idComment: $idComment, takedown: $takedown, deleted: $deleted, active:$active) {
      status 
      id
    }
  }
`

export const CREATE_NEW_ADMIN = gql`
  mutation CreateNewAdmin($email: String!, $level: Int!, $name: String!, $accessCode: String!) {
    registerAdmin(email: $email, level: $level, name: $name, accessCode: $accessCode)
  }
`

export const DELETE_ITEM_THEME = gql`
  mutation DeleteItemThemeById($attr: String!, $themeId: ID!, $id: ID!) {
    deleteConfigThemesById(attr: $attr, id: $id, themeId: $themeId) {
      id
      name
    }
  }
`

export const APPROVED_REQUEST_ADMIN = gql`
  mutation ApproveRequest($notifId: ID, $approve: Boolean){
    approveAdminAction(notifId:$notifId, approve: $approve) {
      status
      id
      message
    }
  }
`