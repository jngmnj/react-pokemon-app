import React, { useEffect, useState } from 'react'

export const useDebounce = (value, delay) => {
	const [deboucedValue, setDebouncedValue] = useState(value);

	useEffect(() => {

		const handler =	setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

  return deboucedValue;
}
