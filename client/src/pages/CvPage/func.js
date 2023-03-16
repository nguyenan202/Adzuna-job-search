

const processCV = (fileds = []) => {

    const cvField = {
        fullName: null,
        email: null,
        phone: null,
        dob: null,
        address: null,
        position: null,
        overView: null,
        Skills: [],
        Education: [],
        Experiences: [],
        Certifications: []
    }


    for (let i = 0; i < fileds.length; ++i) {
        
        // regex get field of Name
        if (/^(?=.*\b(name|tên)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1])
            cvField.fullName = fileds[i+1]
        
        // regex get field of Dob
        if (/^(?=.*\b(birth|ngày sinh)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1])
            cvField.dob = fileds[i+1]

        // regex get field of Phone number
        if (/^(?=.*\b(phone|contact|số điện thoại)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1])
            cvField.phone = fileds[i+1]

        // regex get field of Email
        if (/^(?=.*\b(email)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1])
            cvField.email = fileds[i+1]

        // regex get field of address
        if (/^(?=.*\b(address|địa chỉ|nơi ở)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1])
            cvField.address = fileds[i+1]
        
        // regex get field of position
        if (/^(?=.*\b(developer|manager|designer|tester|saler|marketing|art|enginering)\b).*$/.test(fileds[i].toLowerCase()))
            cvField.position = fileds[i]
        
        // regex get field of overview
        if (/^(?=.*\b(overview|giới thiệu|my profile|objective|about me|summary)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1]) {

            // loop all overview || giới thiệu in CV
            let j = i+1;
            let overview = '';
            while (!/^(?=.*\b(education|overview|experience|award|project|skill)\b).*$/.test(fileds[j].toLowerCase())) {
                overview += fileds[j]
                j++;
                if (!/^(?=.*\b(education|overview|experience|award|project|skill)\b).*$/.test(fileds[j].toLowerCase()))
                    overview += '\r\n'
            }

            cvField.overView = overview
        }

        // regex get field of skills
        if (/^(?=.*\b(skills|kỹ năng)\b).*$/.test(fileds[i].toLowerCase()) && fileds[i+1]) {

            // loop all overview || giới thiệu in CV
            let j = i+1;
            while (!/^(?=.*\b(education|overview|experience|award|project|skill|projects)\b).*$/.test(fileds[j].toLowerCase())) {
                cvField.Skills.push({
                    id: new Date().valueOf() + j + '',
                    name: fileds[j]
                })
                j++;
                if (j > fileds.length) break;
            }
        }
    }

    return cvField;
}


export {
    processCV
}