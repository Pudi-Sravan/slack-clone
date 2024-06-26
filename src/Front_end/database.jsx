import supabase from "./supabase.jsx";
import bcrypt from "bcryptjs";

export async function Getuserdetails(id) {
  let { data: specific_user_data, error } = await supabase
    .from("user_data") //to get the user details from the users table via id i.e uuid
    .select("*") //selecting all coloumns
    .eq("id", id); //gets the row where the id matches
  if (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
  return specific_user_data;
}
export async function CheckemailExists(email) {
  let { data: user_data, error1 } = await supabase
    .from("user_data") //to check whether the entered mail exists in the users table
    .select("email") // Select only the 'email' column
    .eq("email", email);

  if (error1) {
    console.error("Error checking email:", error1);
    return false;
  }

  return user_data?.length > 0; // Return true if data exists
}
export async function PasswordCheck(email, pass) {
  let { data: specific_user_data, error } = await supabase //we check the password using the mail which exists in the users table
    .from("user_data")
    .select("*") //selecting all coloumns
    .eq("email", email);
  console.log(specific_user_data[0].hashed_password);
  const Passwordmatch = await bcrypt.compare(
    pass,
    specific_user_data[0].hashed_password
  );
  if (Passwordmatch) {
    return true;
  } else {
    return false;
  }
}
export async function idm(id) {
  try {
    const { data, error } = await supabase
      .from("direct_messages")
      .insert([{ id: id }])
      .select();
    if (data) {
      console.log("idm");
      return true;
    } else {
      //insert new row with a new users uuid into direct_messages where all dm contacts data be stored
      console.log("idm", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return "false1";
  }
}
export async function UserdetailsbyName(username) {
  let { data: specific_user_data, error } = await supabase
    .from("user_data")
    .select("*")
    .ilike("username", `%${username}%`); // Using ilike for case-insensitive search and pattern matching

  if (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
  return specific_user_data;
}
export async function fetchUserDmChats(user) {
  let { data: dmstored, error } = await supabase //to fetch the dm contacts of a user from the direct_messages table
    .from("direct_messages")
    .select("dm_chats")
    .eq("id", user.id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    return dmstored[0]?.dm_chats || [];
  }
}
export async function fetchUserDmChatsid(id) {
  let { data: dmstored, error } = await supabase //to fetch the dm contacts of a user from the direct_messages table
    .from("direct_messages")
    .select("dm_chats")
    .eq("id", id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    return dmstored[0]?.dm_chats || [];
  }
}
export async function fetchUsermessages(id) {
  let { data: messagesstored, error } = await supabase //to fetch the messages in the dm_chats table via the combined id
    .from("chats_dm")
    .select("messages")
    .eq("id", id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    if (messagesstored[0].messages == null) {
      return [];
    } else {
      return messagesstored[0].messages;
    }
  }
}
export async function insertidforchannel(id) {
  try {
    const { data, error } = await supabase
      .from("channels_list")
      .insert([{ id: id }])
      .select();
    if (data) {
      console.log("done insert for id of channel");
      return true;
    } else {
      //insert new row with a new users uuid into channels_list where all dm contacts data be stored
      console.log("insert id for channel", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return "false1";
  }
}
export async function insertchannelid(id, name) {
  try {
    const { data, error } = await supabase
      .from("channels_message")
      .insert([{ channel_id: id, channel_name: name }])
      .select();
    if (data) {
      console.log("done insert for id of channel");
      return true;
    } else {
      //insert new row with a new users uuid into channels_list where all dm contacts data be stored
      console.log("insert id for channel", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchUserchannels(user) {
  let { data: channelsstored, error } = await supabase //to fetch the channels of a user from the channels_list table
    .from("channels_list")
    .select("channels")
    .eq("id", user.id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    return channelsstored[0]?.channels || [];
  }
}
export async function fetchUserchannelsbyid(id) {
  let { data: channelstored, error } = await supabase //to fetch the channels of a user from the channels_list table
    .from("channels_list")
    .select("channels")
    .eq("id", id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    return channelstored[0]?.channels || [];
  }
}
export async function fetchUserchannelmessages(id) {
  let { data: channelmessages, error } = await supabase //to fetch the messages in the channels_message table
    .from("channels_message")
    .select("messages")
    .eq("channel_id", id);

  if (error) {
    console.error("Error fetching user data:", error);
  } else {
    if (channelmessages[0].messages == null) {
      return [];
    } else {
      return channelmessages[0].messages;
    }
  }
}
export async function fetchUserchannelmembers(id) {
  let { data: channelmembers, error } = await supabase //to fetch the messages in the channels_message table
    .from("channels_message")
    .select("channel_members")
    .eq("channel_id", id);

  if (channelmembers) {
    if (channelmembers[0].channel_members == null) {
      return [];
    } else {
      return channelmembers[0].channel_members;
    }
  } else {
    console.error("Error fetching user data:", error);
  }
}
export async function insertchannelmember(id, members) {
  try {
    const { data, error } = await supabase
      .from("channels_message")
      .update({ channel_members: members })
      .eq("channel_id", id)
      .select();
    if (data) {
      console.log("done insert for member of channel");
      return true;
    } else {
      //insert new row with a new users uuid into channels_list where all dm contacts data be stored
      console.log("insert member for channel", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchchannelmember(id) {
  try {
    const { data: members, error } = await supabase
      .from("channels_message")
      .select("channel_members")
      .eq("channel_id", id);
    if (error) {
      console.log("error fething members", error);
    } else {
      console.log("recieved members");
      if (members == null) {
        return [];
      } else {
        return members;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function allidsinlist() {
  try {
    const { data: ids, error } = await supabase
      .from("channels_list")
      .select("id");

    if (ids) {
      console.log("recieved ids");
      return ids;
    } else {
      console.log("error fething members", error);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function updatechannel(id, channels) {
  try {
    const { data: updatedchannels, error } = await supabase
      .from("channels_list")
      .update({ channels: channels })
      .eq("id", id)
      .select();
    if (updatedchannels) {
      console.log("done update of channel");
      return true;
    } else {
      //insert new row with a new users uuid into channels_list where all dm contacts data be stored
      console.log("update channel", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function insertchanneldolistid(id) {
  try {
    const { data, error } = await supabase
      .from("Channel_todolist")
      .insert([{ id: id }])
      .select();
    if (data) {
      console.log("done insert for id of channel do list");
      return true;
    } else {
      //insert new row with a new users uuid into channels_list where all dm contacts data be stored
      console.log("insert id for channel do list", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function insert_todoid(id) {
  try {
    const { data, error } = await supabase
      .from("Todo_list")
      .insert([{ id: id }])
      .select();
    if (data) {
      console.log("done insert for id of to do list");
      return true;
    } else {
      //insert new row with a new users uuid into tos_list where all dm contacts data be stored
      console.log("insert id for to do list", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchusertodo(id) {
  try {
    const { data: usertodo, error } = await supabase
      .from("Todo_list")
      .select("todo_list")
      .eq("id", id);
    if (error) {
      console.log("error fething user todo", error);
    } else {
      console.log("recieved user todo");
      if (usertodo[0].todo_list == null) {
        return [];
      } else {
        return usertodo[0].todo_list;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function fetchchanneltodo(id) {
  try {
    const { data: channeltodo, error } = await supabase
      .from("Channel_todolist")
      .select("todo_list")
      .eq("id", id);
    if (error) {
      console.log("error fething channel todo", error);
    } else {
      console.log("recieved channel todo");
      if (channeltodo[0].todo_list == null) {
        return [];
      } else {
        return channeltodo[0].todo_list;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function insert_taskid(id) {
  try {
    const { data, error } = await supabase
      .from("Mails_sent")
      .insert([{ task_id: id }])
      .select();
    if (data) {
      console.log("done task id insert ");
      return true;
    } else {
      //insert new row with a new users uuid into tos_list where all dm contacts data be stored
      console.log("task id insert ", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function mailtimestampupd(id, timestamp) {
  try {
    const { data: updatedtimestamp, error } = await supabase
      .from("Mails_sent")
      .update({ last_sent: timestamp, t_f: true })
      .eq("task_id", id)
      .select();
    if (updatedtimestamp) {
      console.log("done update of timestamp");
      return true;
    } else {
      //insert new row with a new users uuid into timestamps_list where all dm contacts data be stored
      console.log("update timestamp", error);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchmailsentmsg(id) {
  try {
    const { data: mail_lastsent, error } = await supabase
      .from("Mails_sent")
      .select("last_sent")
      .eq("task_id", id);
    if (error) {
      console.log("error fething last_sent todo", error);
    } else {
      console.log("recieved last_sent todo");
      return mail_lastsent;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function fetchmailbool(id) {
  try {
    const { data: mail_bool, error } = await supabase
      .from("Mails_sent")
      .select("t_f")
      .eq("task_id", id);
    if (error) {
      console.log("error fething t_f todo", error);
    } else {
      console.log("recieved t_f todo");
      if (mail_bool[0].t_f == null) {
        return false;
      } else {
        return mail_bool[0].t_f;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
