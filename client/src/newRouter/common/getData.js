import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";

// 특정 작품 정보 가져오기
export async function getNovel(id) {
    if (id === undefined || id === null) {
        return;
    }
    if (id.length === 0) {
        return;
    }
    const docRef = doc(db, "novel", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { result: true, data: docSnap.data() }
    } else {
        return { result: false };
    }
}

// 특정 유저가 생성한 작품 목록 가져오기
// id : userid
export async function getNovelList(id) {
    let result = [];
    if (id === undefined || id === null) {
        return result;
    }
    if (id.length === 0) {
        return result;
    }
    const docRef = collection(db, "novel");
    const q = query(docRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        result.push(doc.data());
    });
    return result;
}

// 특정 작품의 회차 목록 가져오기
export async function getStoryList(id) {
    try {
        const storyCollectionRef = collection(db, "novel", id, "story"); // "story" 컬렉션 참조
        const querySnapshot = await getDocs(storyCollectionRef); // 모든 문서 가져오기
        const storyList = querySnapshot.docs.map(doc => (doc.data()));
        return storyList; // 가져온 회차 목록 반환
    } catch (error) {
        console.error("회차 목록 가져오기 실패:", error);
        return [];
    }
}

// 특정 회차 데이터 가져오기
export async function getStory(id, round) {
    try {
        const novelRef = doc(db, "novel", id);
        const novelSnap = await getDoc(novelRef); // 해당 문서 가져오기
        const storyDocRef = doc(db, "novel", id, "story", String(round));
        const storySnap = await getDoc(storyDocRef); // 해당 문서 가져오기
        if (storySnap.exists()) {
            return { data: storySnap.data(), novel: novelSnap.data() }; // 문서 ID와 데이터 반환
        } else {
            console.warn("존재하지 않는 회차입니다.");
            return null;
        }
    } catch (error) {
        console.error("회차 가져오기 실패:", error);
        return null;
    }
}

// export async function getNovelList() {
//     let result = [];
//     const querySnapshot = await getDocs(collection(db, "novel"));
//     querySnapshot.forEach((doc) => {
//         result.push(doc.data());
//     });
//     return result;
// }

export async function getReconetNovelList() {
    let result = [];
    const docRef = collection(db, "novel");
    const q = query(docRef, orderBy("create_at", "desc"), limit(3));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        result.push(doc.data());
    });
    return result;
}

export async function getPopularNovelList() {
    let result = [];
    const docRef = collection(db, "novel");
    const q = query(docRef, orderBy("view", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        result.push(doc.data());
    });
    return result;
}

// 정렬페이지 데이터 가져오기
export async function getSortData() {
    let popularResult = [];
    let recentResult = [];
    const docRef = collection(db, "novel");
    const popular = query(docRef, orderBy("view", "desc"), limit(10));
    const popularSnapshot = await getDocs(popular);
    popularSnapshot.forEach((doc) => {
        popularResult.push(doc.data());
    });
    const recent = query(docRef, orderBy("create_at", "desc"), limit(10));
    const recentSnapshot = await getDocs(recent);
    recentSnapshot.forEach((doc) => {
        recentResult.push(doc.data());
    });
    return { popular: popularResult, recent: recentResult };
}

// 유저 데이터 가져오기
export async function getUser(email) {
    const docRef = doc(db, "user", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return false;
    }
}

export async function getSearchData(search) {
    let titleList = [];
    let writerList = [];
    try {
        // 제목 검색
        const q_title = query(
            collection(db, "novel"),
            where("title", ">=", search),
            where("title", "<=", search + "\uf8ff")
        );
        const titleSnapshot = await getDocs(q_title);
        titleSnapshot.forEach((doc) => {
            titleList.push(doc.data());
        });
        // 작가명 검색
        const q_writer = query(
            collection(db, "novel"),
            where("write_name", ">=", search),
            where("write_name", "<=", search)
        );
        const writerSnapshot = await getDocs(q_writer);
        writerSnapshot.forEach((doc) => {
            writerList.push(doc.data());
        });
        return { title: titleList, writer: writerList }
    } catch (e) {
        return false;
    }

}