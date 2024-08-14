import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.emman.aora",
  projectId: "66b4f93e00289bafa450",
  databaseId: "66b4fa650005f309c992",
  userCollectionId: "66b4fa7e0018f4dd833f",
  videoCollectionId: "66b4fa9f0000f7074594",
  storageId: "66b4fbd80001eb45b429",
};

const client = new Client()
  .setEndpoint(config.endpoint) // Your API Endpoint
  .setProject(config.projectId)
  .setPlatform(config.platform); // Your project ID

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUserAccount = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Cannot create account. Please try again");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getCurrentUSer() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("Invalid account");
    return currentUser.documents[0];
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function searchPosts(query: any) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("users", userId)]
    );

    return posts.documents;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video")
      fileUrl = storage.getFileView(config.storageId, fileId);
    else if (type === "thumbnail")
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    else throw new Error("Invalid file type");

    if (!fileUrl) throw new Error("No file URL");

    return fileUrl;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export const uploadFile = async (file: any, type: string) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export async function createVideo(form: any) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "thumbnail"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
