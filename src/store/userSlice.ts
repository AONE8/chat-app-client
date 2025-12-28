import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { type IsError, type UserProfile } from "@/types/userTypes";

import {
  updateAlias,
  updateAvatar,
  updateDescription,
  updateEmail,
  updateIsDarkMode,
  updateIsShownActivityStatus,
  updateIsShownAvatar,
  updateIsShownPhoneNumber,
  updateLanguage,
  updateName,
  updatePhoneNumber,
  updatetIsShownOriginalText,
  updatetIsTranslatedDocs,
} from "./userActions";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null as UserProfile | null,
    userUpdating: false,
    isShownActivityStatus: true,
    isShownPhoneNumber: true,
    isShownDescription: true,
    isShownAvatar: true,
    isShownOriginalText: true,
    isTranslatedDocs: true,
    isDarkMode: false,
    isError: {
      username: false,
      alias: false,
      email: false,
      phoneNumber: false,
      description: false,
      avatar: false,
    } as IsError,
  },
  reducers: {
    setUser(state, action) {
      state.profile = action.payload.profile;
      state.isShownActivityStatus =
        action.payload.uiSettings.isShownActivityStatus;
      state.isShownPhoneNumber = action.payload.uiSettings.isShownPhoneNumber;
      state.isShownAvatar = action.payload.uiSettings.isShownAvatar;
      state.isShownOriginalText = action.payload.uiSettings.isShownOriginalText;
      state.isTranslatedDocs = action.payload.uiSettings.isTranslatedDocs;
      state.isDarkMode = action.payload.uiSettings.isDarkMode;
    },
    resetUser(state) {
      state.profile = null;
    },
    setContacts(state, action) {
      if (state.profile) {
        state.profile.contacts = action.payload.contacts;
      }
    },
    setUiSettings(state, action) {
      state.isShownActivityStatus = action.payload.isShownActivityStatus;
      state.isShownPhoneNumber = action.payload.isShownPhoneNumber;
      state.isShownAvatar = action.payload.isShownAvatar;
      state.isShownOriginalText = action.payload.isShownOriginalText;
      state.isTranslatedDocs = action.payload.isTranslatedDocs;
      state.isDarkMode = action.payload.isDarkMode;
    },

    setIsShownDescription(state) {
      state.isShownDescription = !state.isShownDescription;
    },

    setIsShownActivityStatus(state) {
      state.isShownActivityStatus = !state.isShownActivityStatus;
    },

    setIsShownPhoneNumber(state) {
      state.isShownPhoneNumber = !state.isShownPhoneNumber;
    },

    setIsShownAvatar(state) {
      state.isShownAvatar = !state.isShownAvatar;
    },

    setIsShownOriginalText(state) {
      state.isShownOriginalText = !state.isShownOriginalText;
    },

    setIsTranslatedDocs(state) {
      state.isTranslatedDocs = !state.isTranslatedDocs;
    },

    setIsDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },

    setLanguage(state, action) {
      if (state.profile) {
        state.profile.language = action.payload.lang;
      }
    },

    updateUser(state, action) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload.user };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateName.rejected, (state) => {
      state.isError.username = true;
    });
    builder.addCase(updateAlias.rejected, (state) => {
      state.isError.alias = true;
    });
    builder.addCase(updateEmail.rejected, (state) => {
      state.isError.email = true;
    });
    builder.addCase(updatePhoneNumber.rejected, (state) => {
      state.isError.phoneNumber = true;
    });
    builder.addCase(updateDescription.rejected, (state) => {
      state.isError.description = true;
    });
    builder.addCase(updateAvatar.rejected, (state) => {
      state.isError.avatar = true;
    });

    builder.addMatcher(
      isAnyOf(
        updateAvatar.pending,
        updateAlias.pending,
        updateName.pending,
        updateEmail.pending,
        updateDescription.pending,
        updatePhoneNumber.pending,
        updateIsShownActivityStatus.pending,
        updateIsShownAvatar.pending,
        updateIsShownPhoneNumber.pending,
        updatetIsShownOriginalText.pending,
        updatetIsTranslatedDocs.pending,
        updateIsDarkMode.pending,
        updateLanguage.pending
      ),
      (state) => {
        state.userUpdating = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        isAnyOf(updateAvatar.fulfilled, updateAvatar.rejected),
        isAnyOf(updateAlias.fulfilled, updateAlias.rejected),
        isAnyOf(updateName.fulfilled, updateName.rejected),
        isAnyOf(updateEmail.fulfilled, updateEmail.rejected),
        isAnyOf(updateDescription.fulfilled, updateDescription.rejected),
        isAnyOf(updatePhoneNumber.fulfilled, updatePhoneNumber.rejected),
        isAnyOf(
          updateIsShownActivityStatus.fulfilled,
          updateIsShownActivityStatus.rejected
        ),
        isAnyOf(updateIsShownAvatar.fulfilled, updateIsShownAvatar.rejected),
        isAnyOf(
          updateIsShownPhoneNumber.fulfilled,
          updateIsShownPhoneNumber.rejected
        ),
        isAnyOf(
          updatetIsShownOriginalText.fulfilled,
          updatetIsShownOriginalText.rejected
        ),
        isAnyOf(
          updatetIsTranslatedDocs.fulfilled,
          updatetIsTranslatedDocs.rejected
        ),
        isAnyOf(updateIsDarkMode.fulfilled, updateIsDarkMode.rejected),
        isAnyOf(updateLanguage.fulfilled, updateLanguage.rejected)
      ),
      (state) => {
        state.userUpdating = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateAvatar.fulfilled, updateAvatar.pending),
      (state) => {
        state.isError.avatar = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateName.fulfilled, updateName.pending),
      (state) => {
        state.isError.username = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateEmail.fulfilled, updateEmail.pending),
      (state) => {
        state.isError.email = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateDescription.fulfilled, updateDescription.pending),
      (state) => {
        state.isError.description = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updatePhoneNumber.fulfilled, updatePhoneNumber.pending),
      (state) => {
        state.isError.phoneNumber = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateAlias.fulfilled, updateAlias.pending),
      (state) => {
        state.isError.alias = false;
      }
    );
  },
});

export const userActions = userSlice.actions;

export default userSlice;
