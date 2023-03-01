export const usersOnline = {
    value: [],
    setValue: function(id) {
        if (!this.value.find(uid => uid === id)) this.value.push(id);
    },
    filterValue: function(id) {
        this.value = this.value.filter(uId => uId !== id)
    }
}