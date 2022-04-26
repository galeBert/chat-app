import gql from 'graphql-tag';

export const GET_THEMES = gql`
  query SearchThemes($name: String) {
    searchThemes(name: $name) {
      id
      name
      isActive
      isDeleted
      colors {
        hex
        id
        name
      }
      adjective {
        id
        name
      }
      nouns {
        id
        avatarUrl
        name
      }
    }
  }
`;

export const GET_GRAPH = gql`
  query GetGraph($graphType: String, $state: String) {
    getGraphSummary(graphType: $graphType, state: $state) {
      summary {
        user {
          total
          newUser
          deleted
          active
        }
        post {
          total
          totalReported
          active
          nonActive
        }
      }
      graph {
        date
        total
      }
    }
  }
`;

export const SEARCH_REPORTED_POST = gql`
  query searchPost(
    $search: String
    $perPage: Int
    $page: Int
    $sortBy: String
    $range: Float
    $location: String
    $filters: RequestFilter
    $useExport: Boolean
  ) {
    searchPosts(
      search: $search
      perPage: $perPage
      page: $page
      range: $range
      sortBy: $sortBy
      hasReported: true
      filters: $filters
      location: $location
      useExport: $useExport
    ) {
      hits {
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
  }
`;

export const SEARCH_ROOMS = gql`
  query SearchRooms(
    $name: String
    $location: String
    $useDetailLocation: Boolean
    $page: Int
    $perPage: Int
    $sortBy: String
  ) {
    searchRoom(
      name: $name
      location: $location
      useDetailLocation: $useDetailLocation
      page: $page
      perPage: $perPage
      sortBy: $sortBy
    ) {
      nbHits
      nbPages
      hits {
        id
        roomName
        totalPosts
        address
        isDeactive
        tillDate
        startingDate
        displayPicture
        description
        createdBy
        createdBy
      }
    }
  }
`;

export const GET_ADMIN_LOGS = gql`
  query GetLog($perPage: Int, $page: Int, $search: String) {
    getAdminLogs(page: $page, perPage: $perPage, search: $search) {
      nbHits
      nbPages
      hits {
        name
        message
        createdAt
        createdAt
        role
      }
    }
  }
`;

export const GET_ADMIN_LOGS_EXPORTS = gql`
  query GetLog(
    $perPage: Int
    $page: Int
    $search: String
    $useExport: Boolean
  ) {
    getAdminLogs(
      page: $page
      perPage: $perPage
      search: $search
      useExport: $useExport
    ) {
      nbHits
      nbPages
      hits {
        name
        message
        createdAt
        createdAt
        role
      }
    }
  }
`;

export const GET_REPORTED_LIST = gql`
  query getPostReportedById($idPost: ID!, $lastId: ID) {
    getReportedByIdPost(idPost: $idPost, lastId: $lastId) {
      nbHits
      nbPages
      hits {
        content
        userIdReporter
        idPost
        username
      }
    }
  }
`;

export const GET_COMMENTS_REPORTED = gql`
  query SearchComments(
    $perPage: Int
    $page: Int
    $sortBy: String
    $filters: RequestFilter
    $search: String
    $useExport: Boolean
  ) {
    searchCommentReported(
      search: $search
      perPage: $perPage
      page: $page
      sortBy: $sortBy
      filters: $filters
      useExport: $useExport
    ) {
      nbHits
      nbPages
      hits {
        text
        timestamp
        reportedCount
        owner
        id
        profilePicture
        isTakedown
        isActive
        status
      }
    }
  }
`;

export const GET_SINGLE_POST = gql`
  query getSinglePost($id: ID!, $room: String, $commentId: ID) {
    getSinglePost(id: $id, room: $room, commentId: $commentId) {
      owner {
        id
        email
        username
        dob
        interest
        profilePicture
        joinDate
        status
      }
      post {
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
    }
  }
`;

export const GET_STATS_USERS_AGE = gql`
  query GetStats {
    getStaticUserByAge {
      label
      total
      percentage
    }
  }
`;

export const GET_DETAIL_ROOM = gql`
  query GetRoomByID($id: ID!) {
    getRoomById(id: $id) {
      id
      roomName
      address
      isDeactive
      tillDate
      startingDate
      displayPicture
      description
      createdBy
      location {
        lat
        lng
        range
        detail {
          formattedAddress
        }
      }
    }
  }
`;

export const GET_ADMIN_LOGIN = gql`
  mutation {
    getAdminLogin {
      name
      level
      id
      email
    }
  }
`;
