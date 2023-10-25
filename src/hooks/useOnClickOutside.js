import { useEffect } from "react";


const onClickOutside = (ref, handler) => {
    useEffect(() => {
        // listner
        const listner = (event) => {
            console.log(event.target)
            // 안을 클릭하면 return, 밖 클릭시 handler 호출
            if(!ref.current || ref.current.contains(event.target)) {
                // listner에서 event받아옴
                // 클릭하는 타겟이 ref.current안에 포함되는지(안을 클릭했는지)
                return;
            }
            handler()
        };

        document.addEventListener('mousedown', listner);
        return () => {
            document.addEventListener("mousedown", listner);
        }
    }, [ref, handler])
}

export default onClickOutside;