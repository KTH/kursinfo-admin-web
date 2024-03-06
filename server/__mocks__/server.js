module.exports = {
  getPaths: () => ({
    course: {
      editDescription: {
        uri: `/mockBase/edit/:courseCode/description`,
      },
      editOtherInformation: {
        uri: `/mockBase/edit/:courseCode/otherInformation`,
      },
    },
  }),
}
