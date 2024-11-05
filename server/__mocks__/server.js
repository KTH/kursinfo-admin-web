module.exports = {
  getPaths: () => ({
    course: {
      editDescription: {
        uri: `/mockBase/edit/:courseCode/description`,
      },
      editOtherInformation: {
        uri: `/mockBase/edit/:courseCode/otherInformation`,
      },
      editRecommendedPrerequisites: {
        uri: `/mockBase/edit/:courseCode/recommendedPrerequisites`,
      },
    },
  }),
}
