export const topicPrimaryStyle = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    color: '#555'
  },
  tab: {
    backgroundColor: theme.palette.primary[500],
    textAlign: 'center',
    display: 'inline-block',
    padding: '0 6px',
    color: '#fff',
    borderRadius: 3,
    marginRight: 10,
    fontSize: '12px'
  }
})

export const topicSecondaryStyles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 3
  },
  count: {
    textAlign: 'center',
    marginRight: 20
  },
  userName: {
    marginRight: 20,
    color: '#9e9e9e'
  },
  accentColor: {
    color: theme.palette.secondary[300]
  }
})

